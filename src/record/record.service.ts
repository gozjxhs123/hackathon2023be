import { HttpException, Injectable, NotFoundException, UnauthorizedException, UseFilters } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { tokenDto } from 'src/auth/dto/token.dto';
import { authEntity } from 'src/auth/entity/auth.entity';
import { HttpExceptionFilter } from 'src/http.exception.filter/http.exception.filter';
import { Repository } from 'typeorm';

@UseFilters(new HttpExceptionFilter())
@Injectable()
export class RecordService {
    constructor(
        @InjectRepository(authEntity) private authEntity: Repository<authEntity>,
        private authService: AuthService,
    ) {
        this.authService = authService; 
    }
    async getMainPage(tokenDto: tokenDto): Promise<object> {
        const { userID } = await this.authService.validateAccess(tokenDto);

        if (!userID) throw new UnauthorizedException();

        const thisUser = await this.authEntity.findOne({
            where: { userID },
        })

        if (!thisUser) throw new NotFoundException();

        return await this.authEntity.findOneBy({userID});
    }
}