import { ResultExecution } from "./Types";
import { ResultDto } from "./ResultDto";

type Metadata = Record<string, any>;
type Headers = Record<string, string>;

export interface IResult {
  statusCode: number | string;
  success: boolean;
  message: string;
  error: string;

  setStatusCode(statusCode: number | string, success: boolean): IResult;
  getStatusCode(): number | string;
  setMessage(message: string, statusCode: number | string): IResult;
  setError(error: string, statusCode: number | string): IResult;
  setSuccess(): void;
  fromResult(result: IResult): IResult;
  hasError(): boolean;
  isSuccess(): boolean;
  hasMessage(): boolean;
  toResultDto(): ResultDto;
  addHeader(name: string, value: string): IResult;
  getHeaders(): Headers | null;
  setMetadata(meta: Metadata): IResult;
  addMetadata(key: string, value: string | number): IResult;
  getMetadata(): Metadata;
  hasMetadata(): boolean;
  execute<RO>(promise: Promise<ResultExecution<RO>>): Promise<IResult & { value: RO }>;
}

export type IBaseResult = Omit<IResult, "toResultDto">;
export { Metadata, Headers };
