import { ApiProperty } from "@nestjs/swagger";

export class PlaycountDto {
    @ApiProperty()
    uri: string;
    @ApiProperty()
    playcount: number;
    @ApiProperty()
    date: number;
}