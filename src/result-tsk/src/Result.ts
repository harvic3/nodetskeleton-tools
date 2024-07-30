import { Metadata, IResult } from "./Result.interface";
import { ResultExecutionPromise } from "./Types";
import { ResultDto } from "./ResultDto";

export class Result implements IResult {
  #metadata: Metadata;
  statusCode: number | string;
  success: boolean;
  message: string;
  error: string;

  setMetadata(metadata: Metadata): IResult {
    this.#metadata = metadata;
    return this;
  }

  addMetadata(key: string, value: string | number): IResult {
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

  setStatusCode(statusCode: number | string, success: boolean): IResult {
    this.statusCode = statusCode;
    this.success = success;
    return this;
  }

  setMessage(message: string, statusCode: number | string): IResult {
    this.message = message;
    this.statusCode = statusCode;
    this.success = true;
    return this;
  }

  setError(error: string, statusCode: number | string): IResult {
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

  async execute<RO>(promise: ResultExecutionPromise<RO>): Promise<IResult & { value: RO }> {
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

    return result;
  }
}
