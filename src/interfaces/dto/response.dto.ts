import { PlaycountDto } from "src/playcount/dto/playcount.dto";

export interface ResponseDto<Object> {
    status: "success" | "failed",
    data?: Object
}
