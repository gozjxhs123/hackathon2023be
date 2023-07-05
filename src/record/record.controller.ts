import { Controller, Get, Headers, UnauthorizedException, UseFilters } from '@nestjs/common';
import { ApiHeader, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
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

    @ApiOperation({ summary: "페이지 접속", description: "페이지 접속 시 userName을 넘겨줌" })
    @ApiHeader({ name: "accesstoken", required: true })
    @ApiHeader({ name: "refreshtoken", required: true })
    @ApiOkResponse({
        status: 200,
        description: "요청 성공"
    })
    @ApiUnauthorizedResponse({
        status: 401,
        description: "토큰이 만료되었거나 올바르지 않은 경우 ( 디코딩 불가 )"
    })
    @Get()
    async getList(@Headers() tokenDto: tokenDto) {
        const data = await this.recordService.getDateList(tokenDto);

        return Object.assign({
            data,
            statusCode: 200,
            statusMsg: "요청 성공"
        })
    }
}
