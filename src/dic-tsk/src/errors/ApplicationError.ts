export class ApplicationError extends Error {
  public constructor(
    context: string,
    message: string,
    errorCode: number | string,
    stack?: string,
  ) {
    super(message);
    this.name = `${context.replace(/\s/g, "")}_${ApplicationError.name}`;
    this.errorCode = errorCode;
    this.stack = stack;
  }
  errorCode: number | string;
}
