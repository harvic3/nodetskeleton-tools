import { Metadata, IResult } from "./Result.interface";
import { ResultExecutionPromise } from "./Types";
import { ResultDto } from "./ResultDto";

export class Result implements IResult {
  #headers?: Record<string, string>;
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

  addHeader(name: string, value: string): IResult {
    if (!this.#headers) this.#headers = {};
    Reflect.set(this.#headers, name, value);

    return this;
  }

  getHeaders(): Record<string, string> | null {
    return this.#headers;
  }

  hasMetadata(): boolean {
    return !!this.#metadata && Object.keys(this.#metadata).length > 0;
  }

  setStatusCode(statusCode: number | string, success: boolean): IResult {
    this.statusCode = statusCode;
    this.success = success;
    return this;
  }

  getStatusCode(): number | string {
    throw new Error("Method not implemented.");
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

  fromResult(result: IResult): IResult {
    this.error = result.error;
    this.message = result.message;
    this.statusCode = result.statusCode;
    this.success = result.success;
    return this;
  }

  hasMessage(): boolean {
    return !!this.message;
  }

  setSuccess(): void {
    this.success = true;
  }

  isSuccess(): boolean {
    return this.success;
  }

  async execute<RO>(
    promise: ResultExecutionPromise<RO>,
  ): Promise<IResult & { value: RO }> {
    const value = await promise
      .then((execution) => {
        if (execution.error) {
          this.setError(execution.error, execution.statusCode);
        }
        return execution.value;
      })
      .catch((error) => {
        console.error(
          `Error on result execute ${new Date().toISOString()}: ${JSON.stringify({ message: error.message, stack: error.stack })}`,
        );
        const errorMessage = error?.statusCode
          ? `${error.message}`
          : `Unexpected application error on execute: ${error.message}`;
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

  static fromError(error: string, statusCode: number | string): IResult {
    return new Result().setError(error, statusCode);
  }

  static fromSuccess(): IResult {
    const result = new Result();
    result.setSuccess();

    return result;
  }
}
