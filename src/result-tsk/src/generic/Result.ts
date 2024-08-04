import { IBaseResult, Metadata } from "../Result.interface";
import { ResultExecutionPromise } from "../Types";
import { IResult } from "./Result.interface";
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

  fromResult(result: IBaseResult): IResult<T> {
    this.error = result.error;
    this.message = result.message;
    this.statusCode = result.statusCode;
    this.success = result.success;
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

  async execute<RO>(promise: ResultExecutionPromise<RO>): Promise<IResult<T> & { value: RO }> {
      const value = await promise.then((execution) => {
        if (execution.error) {
          this.setError(execution.error, execution.statusCode);
        }
        return execution.value;
      }).catch((error) => {
        console.error(`Error on result execute ${new Date().toISOString()}: ${JSON.stringify({ message: error.message, stack: error.stack })}`);
        const errorMessage = error?.statusCode ? `${error.message}` : `Unexpected application error on execute: ${error.message}`;
        const statusCode = error?.statusCode || 500;
        this.setError(errorMessage, statusCode);
        return null;
      });

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
