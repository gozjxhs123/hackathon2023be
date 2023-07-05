import { Controller, Get, Headers, UseFilters } from '@nestjs/common';
import { ApiHeader, ApiHeaders, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { tokenDto } from 'src/auth/dto/token.dto';
import { HttpExceptionFilter } from 'src/http.exception.filter/http.exception.filter';
import { RecordService } from './record.service';

@ApiTags('Record')
@UseFilters(new HttpExceptionFilter())
@Controller('record')
export class RecordController {
    constructor(
        private recordService: RecordService,
    ) {
        this.recordService = recordService;
    }

    @ApiOperation({ summary: "메인 페이지 접속", description: "메인 페이지 접속 시 전화번호 반환 " })
    @ApiHeader({ name: "accesstoken", required: true })
    @ApiHeader({ name: "refreshtoken", required: true })
    @ApiOkResponse({
        status: 200,
        description: "접속 성공"
    })
    @ApiUnauthorizedResponse({
        status: 401,
        description: "토큰이 만료되었거나 올바르지 않은 경우 ( 디코딩 불가 )"
    })
    @ApiNotFoundResponse({
        status: 404,
        description: "존재하지 않는 유저"
    })
    @Get()
    async getMainPage(@Headers() tokenDto: tokenDto): Promise<object> {
        const data = await this.recordService.getMainPage(tokenDto);

        return Object.assign({
            data,
            statusCode: 200,
            statusMsg: "접속 성공"
        })
    }
}
