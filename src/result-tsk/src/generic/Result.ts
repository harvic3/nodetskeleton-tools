import { Metadata } from "../Result.interface";
import { IResult } from "./Result.interface";
import { ResultDto } from "../ResultDto";

export class Result<T> implements IResult<T> {
  #metadata: Metadata;
  data: T | string;
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

  setData(data: string | T, statusCode: number | string, message?: string): void {
    this.data = data;
    this.statusCode = statusCode;
    this.success = true;
    if (message) {
      this.message = message;
    }
  }

  toResultDto(): ResultDto {
    const result = new ResultDto();
    result.error = this.error;
    result.message = this.message;
    result.data = this.data;
    return result;
  }
}
