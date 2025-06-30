import { IBaseResult } from "../Result.interface";
import { ResultExecution } from "../Types";
import { ResultDto } from "../ResultDto";

export interface IResult<T> extends IBaseResult {
  data: T | string;
  setOnlyData(data: T | string): IResult<T>;
  setData(data: T | string, statusCode: number | string): IResult<T>;
  setData(data: T | string, statusCode: number | string, message: string): IResult<T>;
  hasData(): boolean;
  toResultDto(): ResultDto;
  execute<RO>(promise: Promise<ResultExecution<RO>>): Promise<IResult<T> & { value: RO }>;
}
