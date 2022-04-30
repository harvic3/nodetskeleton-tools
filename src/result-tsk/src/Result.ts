import { Metadata, IResult } from "./Result.interface";
import { ResultDto } from "./ResultDto";

export class Result implements IResult {
  #metadata: Metadata;
  statusCode: number | string;
  success: boolean;
  message: string;
  error: string;

  setMetadata(metadata: Metadata): void {
    this.#metadata = metadata;
  }

  addMetadata(key: string, value: string | number): void {
    if (!this.#metadata) this.#metadata = {};
    this.#metadata[key] = value;
  }

  getMetadata(): Metadata {
    return this.#metadata;
  }

  hasMetadata(): boolean {
    return !!this.#metadata && Object.keys(this.#metadata).length > 0;
  }

  setStatusCode(statusCode: number | string, success: boolean): void {
    this.statusCode = statusCode;
    this.success = success;
  }

  setMessage(message: string, statusCode: number | string): void {
    this.message = message;
    this.statusCode = statusCode;
    this.success = true;
  }

  setError(error: string, statusCode: number | string): void {
    this.error = error;
    this.statusCode = statusCode;
    this.success = false;
  }

  hasError(): boolean {
    return !!this.error;
  }

  toResultDto(): ResultDto {
    const result = new ResultDto();
    result.error = this.error;
    result.message = this.message;
    return result;
  }
}
