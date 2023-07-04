import { ApiProperty } from "@nestjs/swagger";

export class tokenDto {
    @ApiProperty({
        example: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOjMsInVzZXJTdHJJRCI6ImFzZCIsImlhdCI6MTY4ODQ2NjE2MCwiZXhwIjoxNjg4NDgwNTYwfQ.6DEtAbTKO8zbXg-Gl8OVIbYDFfH9M0j90LsYYrtpKbw",
        description: "Bearer 토큰 / 만료시간 4시간"
    })
    accesstoken: string;

    @ApiProperty({
        example: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOjMsInVzZXJTdHJJRCI6ImFzZCIsImlhdCI6MTY4ODQ2NjE2MCwiZXhwIjoxNjg5MDcwOTYwfQ.PI4pkjJaDx-DHOuMLpgHQ6z6ZELNX95YBBkEZ1MEGqs",
        description: "Bearer 토큰 / 만료시간 1주일"
    })
    refreshtoken: string;
}