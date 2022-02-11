import { ResultDto } from "./ResultDto";

type Metadata = Record<string, any>;

export interface IResult {
  statusCode: number | string;
  success: boolean;
  message: string;
  error: string;

  setStatusCode(statusCode: number | string, success: boolean): void;
  setMessage(message: string, statusCode: number | string): void;
  setError(error: string, statusCode: number | string): void;
  toResultDto(): ResultDto;
  setMetadata(headers: Metadata): void;
  addMetadata(key: string, value: string | number): void;
  getMetadata(): Metadata;
  hasMetaData(): boolean;
}

export type IBaseResult = Omit<IResult, "toResultDto">;
export { Metadata };
