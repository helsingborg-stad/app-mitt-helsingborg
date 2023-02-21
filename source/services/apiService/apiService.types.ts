import type { AxiosResponse } from "axios";

interface RequestError {
  message: string;
}

export interface RequestResult<T> {
  data: T;
}

export type RequestReturnType<T> = Promise<
  AxiosResponse<RequestResult<T>, unknown> | RequestError
>;

export interface ApiService {
  get<TResponse>(
    endpoint: string,
    headers?: Record<string, string>,
    params?: Record<string, unknown>
  ): Promise<RequestReturnType<TResponse>>;
  post<TResponse>(
    endpoint: string,
    body: unknown,
    headers?: Record<string, string>
  ): Promise<RequestReturnType<TResponse>>;
  remove<TResponse>(
    endpoint: string,
    body?: unknown,
    headers?: Record<string, string>
  ): Promise<RequestReturnType<TResponse>>;
  put<TResponse>(
    endpoint: string,
    body?: unknown,
    headers?: Record<string, string>
  ): Promise<RequestReturnType<TResponse>>;
}
