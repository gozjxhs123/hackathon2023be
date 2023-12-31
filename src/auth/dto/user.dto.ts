import { ApiProperty } from "@nestjs/swagger";

export class userDto {
    @ApiProperty({
        example: "asdf",
        description: "사용자가 로그인 시 사용할 ID"
    })
    userStrID: string;

    @ApiProperty({
        example: "01012345678",
        description: "사용자 전화번호"
    })
    userPhone: string;

    @ApiProperty({
        example: "asdfqwer12!@",
        description: "8글자 이상, 특수문자 1개 이상 포함, 영어 대소문자 포함, 숫자 포함"
    })
    userPW: string;
}