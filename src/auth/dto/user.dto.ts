import { ApiProperty } from "@nestjs/swagger";

export class userDto {
    @ApiProperty({
        example: "asdf",
        description: "사용자가 로그인 시 사용할 ID"
    })
    userStrID: string;

    @ApiProperty({
        example: "김철수",
        description: "사용자 이름"
    })
    userName: string;

    @ApiProperty({
        example: "asdfqwer12!@",
        description: "8글자 이상, 특수문자 1개 이상 포함, 영어 대소문자 포함"
    })
    userPW: string;
}