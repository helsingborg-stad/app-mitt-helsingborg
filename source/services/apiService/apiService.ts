/* eslint-disable import/no-unused-modules */
import axios from "axios";
import { Platform } from "react-native";
import DeviceInfo from "react-native-device-info";

import type { Method, AxiosPromise, AxiosError } from "axios";

import { name } from "../../../package.json";
import { buildServiceUrl } from "../../helpers/UrlHelper";
import { EnvironmentServiceLocator } from "../environment";
import { getUserFriendlyAppVersion } from "../../helpers/Misc";
import StorageService, { ACCESS_TOKEN_KEY } from "../storage/StorageService";

import type {
  ApiService,
  RequestResult,
  RequestReturnType,
} from "./apiService.types";

export default class DefaultApiService implements ApiService {
  // eslint-disable-next-line class-methods-use-this
  async request<TResponse>(
    endpoint: string,
    method: Method,
    data?: unknown,
    headers: Record<string, string> = {},
    params: Record<string, unknown> = {}
  ): Promise<RequestReturnType<TResponse>> {
    const url = await buildServiceUrl(endpoint);
    const token = await StorageService.getData(ACCESS_TOKEN_KEY);
    const { apiKey } = EnvironmentServiceLocator.get().getActive();

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

  get<TResponse>(
    endpoint: string,
    headers?: Record<string, string>,
    params?: Record<string, unknown>
  ): Promise<RequestReturnType<TResponse>> {
    return this.request<TResponse>(endpoint, "get", undefined, headers, params);
  }

  post<TResponse>(
    endpoint: string,
    body: unknown,
    headers?: Record<string, string>
  ): Promise<RequestReturnType<TResponse>> {
    return this.request<TResponse>(endpoint, "post", body, headers);
  }

  remove<TResponse>(
    endpoint: string,
    body?: unknown,
    headers?: Record<string, string>
  ): Promise<RequestReturnType<TResponse>> {
    return this.request<TResponse>(endpoint, "delete", body, headers);
  }

  put<TResponse>(
    endpoint: string,
    body?: unknown,
    headers?: Record<string, string>
  ): Promise<RequestReturnType<TResponse>> {
    return this.request<TResponse>(endpoint, "put", body, headers);
  }
}
