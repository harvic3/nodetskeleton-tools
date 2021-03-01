import { ResultDto } from "./ResultDto";

export interface IResult {
  statusCode: number | string;
  success: boolean;
  message: string;
  error: string;

  setStatusCode(statusCode: number | string, success: boolean): void;
  setMessage(message: string, statusCode: number | string): void;
  setError(error: string, statusCode: number | string): void;
  toResultDto(): ResultDto;
}

export type IBaseResult = Omit<IResult, "toResultDto">;
