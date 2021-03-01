import { IResult } from "./Result.interface";
import { ResultDto } from "../ResultDto";

export class Result<T> implements IResult<T> {
  data: T | string;
  statusCode: number | string;
  success: boolean;
  message: string;
  error: string;

  setStatusCode(statusCode: number | string, success: boolean): void {
    this.statusCode = statusCode;
    this.success = success;
  }

  setMessage(message: string, statusCode: number | string): void {
    this.message = message;
    this.statusCode = statusCode;
    this.success = true;
  }

  setError(error: string, statusCode: number | string): void {
    this.error = error;
    this.statusCode = statusCode;
    this.success = false;
  }

  setData(data: string | T, statusCode: number | string, message?: string): void {
    this.data = data;
    this.statusCode = statusCode;
    this.success = true;
    if (message) {
      this.message = message;
    }
  }

  toResultDto(): ResultDto {
    const result = new ResultDto();
    result.error = this.error;
    result.message = this.message;
    result.data = this.data;
    return result;
  }
}
