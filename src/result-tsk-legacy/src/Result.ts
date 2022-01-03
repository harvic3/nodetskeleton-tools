import { IResult } from "./Result.interface";
import { ResultDto } from "./ResultDto";

export class Result implements IResult {
  statusCode: number | string;
  success: boolean;
  message: string;
  error: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  #trace: any;

  SetStatusCode(statusCode: number | string, success: boolean): void {
    this.statusCode = statusCode;
    this.success = success;
  }

  SetMessage(message: string, statusCode: number | string): void {
    this.message = message;
    this.statusCode = statusCode;
    this.success = true;
    this.#trace = JSON.stringify({ message, statusCode });
  }

  SetError(error: string, statusCode: number | string): void {
    this.error = error;
    this.statusCode = statusCode;
    this.success = false;
    this.#trace = JSON.stringify({ error, statusCode });
  }

  SetTrace(trace: unknown): void {
    this.#trace = trace;
  }

  GetTrace<R>(): R {
    return this.#trace as R;
  }

  ToResultDto(): ResultDto {
    const result = new ResultDto();
    result.error = this.error;
    result.message = this.message;
    return result;
  }
}
