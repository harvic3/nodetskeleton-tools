import { IBaseResult } from "../Result.interface";
import { ResultExecution } from "../Types";
import { ResultDto } from "../ResultDto";

export interface IResult<T> extends IBaseResult {
  data: T | string;
  setData(data: T | string, statusCode: number | string): void;
  setData(data: T | string, statusCode: number | string, message: string): void;
  hasData(): boolean;
  toResultDto(): ResultDto;
  execute<RO>(promise: Promise<ResultExecution<RO>>): Promise<IResult<T> & { value: RO }> ;
}
