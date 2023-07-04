import { Body, Controller, Delete, Headers, Post, UseFilters } from '@nestjs/common';
import { HttpExceptionFilter } from 'src/http.exception.filter/http.exception.filter';
import { AuthService } from './auth.service';
import { tokenDto } from './dto/token.dto';
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
        @Headers() tokenDto: tokenDto,
        @Body('userPW') userPW: string
    ) {
        const data = await this.authService.deleteUserAcc(tokenDto, userPW);

        return Object.assign({
            data,
            statusCode: 204,
            statusMsg: ""
        })
    }

    @Post('login')
    async login(
        @Body() userDto: userDto
    ) {
        const data = await this.authService.login(userDto);

        return Object.assign({
            data,
            statusCode: 201,
            statusMsg: "로그인 성공"
        })
    }
}