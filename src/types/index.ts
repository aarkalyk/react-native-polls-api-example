export * from './questions';

export type ApiCallStatus = 'idle' | 'loading' | 'success' | 'error';
export type ApiResponseData<T> = {
  nextLink?: string;
  lastLink?: string;
  data: T;
};
