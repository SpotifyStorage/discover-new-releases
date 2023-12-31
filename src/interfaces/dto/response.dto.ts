import { PlaycountDto } from "src/playcount/dto/playcount.dto";

export interface ResponseDto<T> {
    status: "success" | "failed",
    data?: T
}
