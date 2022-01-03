import { IBaseResult } from "../Result.interface";
import { ResultDto } from "../ResultDto";

export interface IResult<T> extends IBaseResult {
  data: T | string;
  SetData(data: T | string, statusCode: number | string): void;
  SetData(data: T | string, statusCode: number | string, message: string): void;
  GetTrace<R>(): R;
  ToResultDto(): ResultDto;
  ToResultDto(): ResultDto;
}
