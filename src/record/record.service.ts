import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Redis } from 'ioredis';
import { AuthService } from 'src/auth/auth.service';
import { tokenDto } from 'src/auth/dto/token.dto';
import { authEntity } from 'src/auth/entity/auth.entity';
import { Repository } from 'typeorm';
import { recordEntity } from './entity/record.entity';

@Injectable()
export class RecordService {
    constructor(
        @InjectRepository(recordEntity) private recordEntity: Repository<recordEntity>,
        @InjectRepository(authEntity) private authEntity: Repository<authEntity>,
        private authService: AuthService,
    ) {
        this.authService = authService;
    }
    async getDateList(tokenDto: tokenDto): Promise<object> {
        const { userID } = await this.authService.validateAccess(tokenDto);

        const thisUser = await this.authEntity.findOneByOrFail({ userID });
        if (!thisUser) throw new UnauthorizedException();

        const thisList = await this.recordEntity.find({
            where: { userID },
            select: ['recordDate', 'recordTime']
        });

        return thisList;
    }
}
