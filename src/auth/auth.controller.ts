import { Body, Controller, Delete, Post, UseFilters } from '@nestjs/common';
import { HttpExceptionFilter } from 'src/http.exception.filter/http.exception.filter';
import { AuthService } from './auth.service';
import { userDto } from './dto/user.dto';

@UseFilters(new HttpExceptionFilter())
@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
    ) {
        this.authService = authService;
    }

    @Post('createAcc')
    async createAcc(@Body() user: userDto) {
        const data = await this.authService.createUserAcc(user);

        return Object.assign({
            data,
            statusCode: 201,
            statusMsg: "계정 생성 완료"
        })
    }

    @Delete('deleteAcc')
    async deleteAcc(
        @Body('userID') userID: number,
        @Body('userPW') userPW: string
    ) {
        const data = await this.authService.deleteUserAcc(userID, userPW);

        return Object.assign({
            data,
            statusCode: 204,
            statusMsg: ""
        })
    }
}