export interface IResources {
  getWithParams(resourceName: string, params: Record<string, string>, language?: string): string;
}

export interface IResult {
  setError(message: string, errorCode: ErrorType): void;
}

export type ValidationType = Record<
  string,
  string | number | undefined | null | unknown | CallableFunction[]
>;

export type ErrorType = number | string;
