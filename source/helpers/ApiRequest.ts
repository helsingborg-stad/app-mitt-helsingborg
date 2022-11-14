import type { AxiosError, AxiosResponse, Method, AxiosPromise } from "axios";
import axios from "axios";
import { Platform } from "react-native";
import DeviceInfo from "react-native-device-info";

import StorageService, {
  ACCESS_TOKEN_KEY,
} from "../services/storage/StorageService";
import { buildServiceUrl } from "./UrlHelper";
import { name } from "../../package.json";
import EnvironmentConfigurationService from "../services/EnvironmentConfigurationService";
import { getUserFriendlyAppVersion } from "./Misc";

interface RequestError {
  message: string;
}

interface RequestResult<T> {
  data: T;
}

type RequestReturnType<T> = Promise<
  AxiosResponse<RequestResult<T>, unknown> | RequestError
>;

function isRequestError(maybeError: unknown): maybeError is RequestError {
  return (maybeError as RequestError)?.message?.length > 0;
}

async function request<TResponse>(
  endpoint: string,
  method: Method,
  data?: unknown,
  headers: Record<string, string> = {},
  params: Record<string, unknown> = {}
): RequestReturnType<TResponse> {
  const url = await buildServiceUrl(endpoint);
  const token = await StorageService.getData(ACCESS_TOKEN_KEY);
  const { apiKey } =
    EnvironmentConfigurationService.getInstance().activeEndpoint;

  const friendlyVersion = getUserFriendlyAppVersion();
  const applicationVersion = DeviceInfo.getVersion();

  const userAgent = `${name}/${applicationVersion}/${Platform.OS}/${Platform.Version}/${friendlyVersion}`;

  // Merge custom headers
  const newHeaders = {
    Authorization: token || "",
    "Content-Type": "application/json",
    "x-api-key": apiKey,
    "User-Agent": userAgent,
    ...headers,
  };

  try {
    // Do request
    const req = axios({
      url,
      method,
      headers: newHeaders,
      data,
      params,
    }) as AxiosPromise<RequestResult<TResponse>>;
    const response = await req;
    return response;
  } catch (error) {
    const axiosError = error as AxiosError;
    return { message: axiosError.message, ...axiosError.response };
  }
}

function get<TResponse = unknown>(
  endpoint: string,
  headers?: Record<string, string>,
  params?: Record<string, unknown>
): RequestReturnType<TResponse> {
  return request<TResponse>(endpoint, "get", undefined, headers, params);
}

function post<TResponse = unknown>(
  endpoint: string,
  body: unknown,
  headers?: Record<string, string>
): RequestReturnType<TResponse> {
  return request<TResponse>(endpoint, "post", body, headers);
}

function remove<TResponse = unknown>(
  endpoint: string,
  body?: unknown,
  headers?: Record<string, string>
): RequestReturnType<TResponse> {
  return request<TResponse>(endpoint, "delete", body, headers);
}

function put<TResponse = unknown>(
  endpoint: string,
  body?: unknown,
  headers?: Record<string, string>
): RequestReturnType<TResponse> {
  return request<TResponse>(endpoint, "put", body, headers);
}

function patch<TResponse = unknown>(
  endpoint: string,
  body?: unknown,
  headers?: Record<string, string>
): RequestReturnType<TResponse> {
  return request<TResponse>(endpoint, "patch", body, headers);
}

export { isRequestError, get, post, remove, put, patch };
