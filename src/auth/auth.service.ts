import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { ConflictException, ForbiddenException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException, UseFilters } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Redis } from 'ioredis';
import { HttpExceptionFilter } from 'src/http.exception.filter/http.exception.filter';
import { Repository } from 'typeorm';
import { authEntity } from './entity/auth.entity';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import axios from 'axios';
import { userDto } from './dto/user.dto';

@UseFilters(new HttpExceptionFilter())
@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(authEntity) private authEntity: Repository<authEntity>,
        @InjectRedis() private readonly redis: Redis,
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

    async deleteUserAcc(userID: number, userPW: string): Promise<object> {
        const thisUser = await this.authEntity.findOneBy({ userID });

        if (!thisUser) throw new NotFoundException();

        if (!await bcrypt.compare(userPW, thisUser.userPW)) throw new ForbiddenException();

        await this.authEntity.delete({ userID });

        return thisUser;
    }
}