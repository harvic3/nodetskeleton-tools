import { Metadata } from "../Result.interface";
import { IResult } from "./Result.interface";
import { ResultExecution } from "../Types";
import { ResultDto } from "../ResultDto";

export class Result<T> implements IResult<T> {
  #metadata: Metadata;
  data: T | string;
  statusCode: number | string;
  success: boolean;
  message: string;
  error: string;

  setMetadata(metadata: Metadata): IResult<T> {
    this.#metadata = metadata;
    return this;
  }

  addMetadata(key: string, value: string | number): IResult<T> {
    if (!this.#metadata) this.#metadata = {};
    this.#metadata[key] = value;
    return this;
  }

  getMetadata(): Metadata {
    return this.#metadata;
  }

  hasMetadata(): boolean {
    return !!this.#metadata && Object.keys(this.#metadata).length > 0;
  }

  setStatusCode(statusCode: number | string, success: boolean): IResult<T> {
    this.statusCode = statusCode;
    this.success = success;
    return this;
  }

  setMessage(message: string, statusCode: number | string): IResult<T> {
    this.message = message;
    this.statusCode = statusCode;
    this.success = true;
    return this;
  }

  setError(error: string, statusCode: number | string): IResult<T> {
    this.error = error;
    this.statusCode = statusCode;
    this.success = false;
    return this;
  }

  hasError(): boolean {
    return !!this.error;
  }

  hasMessage(): boolean {
    return !!this.message;
  }

  hasData(): boolean {
    return !!this.data;
  }

  setData(data: string | T, statusCode: number | string, message?: string): IResult<T> {
    this.data = data;
    this.statusCode = statusCode;
    this.success = true;
    if (message) {
      this.message = message;
    }
    return this;
  }

  async execute<RO>(promise: Promise<ResultExecution<RO>>): Promise<IResult<T> & { value: RO }> {
    
    const execution = await promise;
    let value: RO = execution === null || execution === undefined ? undefined : execution.value;
    if (execution.error) {
      this.setError(execution.error, execution.statusCode);
    } else {
      value = execution.value;
    }

    return {
      ...this,
      value,
    };
  }


  toResultDto(): ResultDto {
    const result = new ResultDto();
    result.error = this.error;
    result.message = this.message;
    result.data = this.data;

    return result;
  }
}
