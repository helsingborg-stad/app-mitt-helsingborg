export type RequestMethod = "put" | "get" | "post" | "delete";
export type RequestHeaders = Record<string, unknown>;
export type RequestParams = Record<string, unknown>;
export type RequestBody = Record<string, unknown> | undefined | string | null;

interface ResponseData<T> {
  data: {
    data: T;
  };
  status: number;
  message?: string;
}

export type RequestResponseType<T> = Promise<ResponseData<T>>;
