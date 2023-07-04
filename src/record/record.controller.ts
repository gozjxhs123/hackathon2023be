import { Controller, Get, Headers } from '@nestjs/common';
import { tokenDto } from 'src/auth/dto/token.dto';
import { RecordService } from './record.service';

@Controller('record')
export class RecordController {
    constructor(
        private recordService: RecordService,
    ) {
        this.recordService = recordService;
    }

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
