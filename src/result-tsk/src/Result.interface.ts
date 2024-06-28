import { ResultExecution } from "./Types";
import { ResultDto } from "./ResultDto";

type Metadata = Record<string, any>;

export interface IResult {
  statusCode: number | string;
  success: boolean;
  message: string;
  error: string;

  setStatusCode(statusCode: number | string, success: boolean): IResult;
  setMessage(message: string, statusCode: number | string): IResult;
  setError(error: string, statusCode: number | string): IResult;
  hasError(): boolean;
  hasMessage(): boolean;
  toResultDto(): ResultDto;
  setMetadata(headers: Metadata): IResult;
  addMetadata(key: string, value: string | number): IResult;
  getMetadata(): Metadata;
  hasMetadata(): boolean;
  execute<RO>(promise: Promise<ResultExecution<RO>>): Promise<IResult & { value: RO }> ;
}

export type IBaseResult = Omit<IResult, "toResultDto">;
export { Metadata };
