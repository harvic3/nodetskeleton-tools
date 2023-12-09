export type ResultExecutionPromise<RO> = Promise<ResultExecution<RO>>

export type ResultExecution<RO> = {
  value: RO | null,
  statusCode?: number | string | null,
  error?: string | null,
};
