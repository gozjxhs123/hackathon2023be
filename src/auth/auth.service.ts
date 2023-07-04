import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { ConflictException, ForbiddenException, Injectable, NotFoundException, UnauthorizedException, UseFilters } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Redis } from 'ioredis';
import { HttpExceptionFilter } from 'src/http.exception.filter/http.exception.filter';
import { Repository } from 'typeorm';
import { authEntity } from './entity/auth.entity';
import * as bcrypt from 'bcrypt';
import { userDto } from './dto/user.dto';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { tokenDto } from './dto/token.dto';
import { tokenResultDto } from './dto/tokenResult.dto';

@UseFilters(new HttpExceptionFilter())
@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(authEntity) private authEntity: Repository<authEntity>,
        @InjectRedis() private readonly redis: Redis,
        private readonly jwt: JwtService,
        private config: ConfigService,
    ) {
        this.authEntity = authEntity;
    }

    async createUserAcc(user: userDto): Promise<object> {
        
        const { userStrID, userPW } = user;
        
        if (await this.authEntity.findOneBy({ userStrID })) throw new ConflictException();

        if (!userPW.match("^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$")) throw new ConflictException();

        const userHashedPW: string = await bcrypt.hash(userPW, 10);

        const newUser = await this.authEntity.save({
            userStrID,
            userPW: userHashedPW,
        })

        return newUser;
    }

    async deleteUserAcc(tokenDto: tokenDto, userPW: string): Promise<object> {
        const userID = (await this.validateAccess(tokenDto)).userID;

        const thisUser = await this.authEntity.findOneBy({ userID });

        if (!thisUser) throw new NotFoundException();

        if (!await bcrypt.compare(userPW, thisUser.userPW)) throw new ForbiddenException();

        await this.authEntity.delete({ userID });

        return thisUser;
    }

    async login(userDto: userDto): Promise<object> {
        const { userStrID, userPW } = userDto;

        const thisUser = await this.authEntity.findOneBy({ userStrID });

        if (!await bcrypt.compare(userPW, thisUser.userPW)) throw new ConflictException();

        const access = await this.generateAccessToken(thisUser.userID, thisUser.userStrID);
        const refresh = await this.generateRefreshToken(thisUser.userID, thisUser.userStrID);

        await this.redis.set(`${thisUser.userID}AccessToken`, access);
        await this.redis.set(`${thisUser.userID}RefreshToken`, refresh);

        return {
            accessToken: access,
            refreshToken: refresh
        }
    }

    async generateAccessToken(userID: number, userStrID: string) {
        const payload = {
            userID,
            userStrID
        }

        const access = await this.jwt.sign(payload, {
            secret: this.config.get<string>('process.env.JWT_SECRET_ACCESS')
        })

        return `Bearer ${access}`
    }

    async generateRefreshToken(userID: number, userStrID: string) {
        const payload = {
            userID,
            userStrID
        }

        const refresh = await this.jwt.sign(payload, {
            secret: this.config.get<string>('process.env.JWT_SECRET_REFRESH'),
            expiresIn: '7d'
        })
        
        return `Bearer ${refresh}`;
    }

    async validateAccess(tokenDto: tokenDto): Promise<tokenResultDto> {
        const accesstoken = tokenDto.accesstoken.split(' ')[1]
        const refreshtoken = tokenDto.refreshtoken.split(' ')[1]

        const access = await this.jwt.verifyAsync(accesstoken, {
            secret: this.config.get<string>('process.env.JWT_SECRET_ACCESS')
        })

        if (!access) {
            const refresh: tokenResultDto = await this.jwt.verifyAsync(refreshtoken, {
                secret: this.config.get<string>('process.env.JWT_SECRET_REFRESH')
            })
            if (!refresh) throw new UnauthorizedException();
            const accessToken = await this.generateAccessToken(refresh.userID, refresh.userStrID);
            await this.redis.set(`${refresh.userID}AccessToken`, accessToken);

            return refresh;
        }

        return access;
    }
}