import { Body, Controller, Delete, Headers, Post, UseFilters } from '@nestjs/common';
import { ApiBody, ApiConflictResponse, ApiCreatedResponse, ApiHeader, ApiHeaders, ApiNoContentResponse, ApiNotFoundResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { HttpExceptionFilter } from 'src/http.exception.filter/http.exception.filter';
import { AuthService } from './auth.service';
import { tokenDto } from './dto/token.dto';
import { userDto } from './dto/user.dto';

@ApiTags('Auth')
@UseFilters(new HttpExceptionFilter())
@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
    ) {
        this.authService = authService;
    }

    @ApiOperation({ summary: "계정 생성", description: "회원가입 API" })
    @ApiBody({ type: userDto })
    @ApiCreatedResponse({
        status: 201,
        description: "계정 생성 완료"
    })
    @ApiConflictResponse({
        status: 409,
        description: "userStrID가 중복되는 경우"
    })
    @ApiConflictResponse({
        status: 409,
        description: "비밀번호 생성 규칙에 어긋나는 경우"
    })
    @Post('createAcc')
    async createAcc(@Body() user: userDto) {
        const data = await this.authService.createUserAcc(user);

        return Object.assign({
            data,
            statusCode: 201,
            statusMsg: "계정 생성 완료"
        })
    }

    @ApiOperation({ summary: "계정 삭제", description: "회원탈퇴 API" })
    @ApiBody({ type: tokenDto })
    @ApiBody({ type: `string` })
    @ApiNoContentResponse({
        status: 204,
        description: ""
    })
    @ApiNotFoundResponse({
        status: 404,
        description: "존재하지 않는 userID"
    })
    @ApiConflictResponse({
        status: 409,
        description: "비밀번호가 유저 비밀번호와 불일치하는 경우"
    })
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

    @ApiOperation({ summary: "로그인", description: "로그인 API" })
    @ApiBody({ type: userDto })
    @ApiCreatedResponse({
        status: 201,
        description: "로그인 성공"
    })
    @ApiConflictResponse({
        status: 409,
        description: "비밀번호가 유저 비밀번호와 불일치하는 경우"
    })
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

    @ApiOperation({ summary: "로그아웃", description: "로그아웃 API" })
    @ApiHeader({ name: "accesstoken", required: true })
    @ApiHeader({ name: "refreshtoken", required: true })
    @ApiNoContentResponse({
        status: 204,
        description: "로그아웃 성공"
    })
    @ApiUnauthorizedResponse({
        status: 401,
        description: "토큰이 만료되었거나 올바르지 않은 경우 ( 디코딩 불가 )"
    })
    @Delete('logout')
    async logout(@Headers() tokenDto: tokenDto) {
        const data = await this.authService.logout(tokenDto);

        return Object.assign({
            data,
            statusCode: 204,
            statusMsg: "로그아웃 성공"
        })
    }
}