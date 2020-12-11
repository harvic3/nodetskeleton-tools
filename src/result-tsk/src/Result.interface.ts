import { ResultDto } from "./ResultDto";

export interface IResult {
  statusCode: number | string;
  success: boolean;
  message: string;
  error: string;
  SetStatusCode(statusCode: number | string, success: boolean): void;
  SetMessage(message: string, statusCode: number | string): void;
  SetError(error: string, statusCode: number | string): void;
  ToResultDto(): ResultDto;
}

export type IBaseResult = Omit<IResult, "ToResultDto">;
