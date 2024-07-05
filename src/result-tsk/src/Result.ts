import { ResultExecution, ResultExecutionPromise } from "./Types";
import { Metadata, IResult } from "./Result.interface";
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
    return this;
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

  async execute<RO>(promise: Promise<ResultExecution<RO>>): Promise<IResult & { value: RO }> {
    const execution = await promise;
    if (execution.error) {
      this.setError(execution.error, execution.statusCode);
    }
    const value = execution.value;

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
