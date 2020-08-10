import { IResult } from "./Result.interface";
import { ResultDto } from "../ResultDto";
export declare class Result<T> implements IResult<T> {
    data: T | string;
    statusCode: number;
    success: boolean;
    message: string;
    error: string;
    SetStatusCode(statusCode: number, success: boolean): void;
    SetMessage(message: string, statusCode: number): void;
    SetError(error: string, statusCode: number): void;
    SetData(data: string | T, statusCode: number): void;
    ToResultDto(): ResultDto;
}
