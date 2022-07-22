import axios from "axios";
import { Platform } from "react-native";
import DeviceInfo from "react-native-device-info";

import StorageService, { ACCESS_TOKEN_KEY } from "../services/StorageService";
import { buildServiceUrl } from "./UrlHelper";
import { name } from "../../package.json";
import EnvironmentConfigurationService from "../services/EnvironmentConfigurationService";
import { getUserFriendlyAppVersion } from "./Misc";

import type {
  RequestMethod,
  RequestHeaders,
  RequestParams,
  RequestBody,
  RequestResponseType,
} from "./ApiRequest.types";

/**
 * Axios request
 * User ID will overwrite bearer token in header.
 *
 * @param {string} endpoint
 * @param {string} method
 * @param {obj} data
 * @param {obj} headers
 */
const request = async (
  endpoint: string,
  method: RequestMethod,
  data: RequestBody,
  headers: Record<string, unknown> = {},
  params: Record<string, unknown> = {}
) => {
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
    const req = await axios({
      url,
      method,
      headers: newHeaders,
      data,
      params,
    });
    return req;
  } catch (error) {
    return { message: error.message, ...error.response };
  }
};

const get = <T>(
  endpoint: string,
  headers?: RequestHeaders,
  params?: RequestParams
): RequestResponseType<T> =>
  request(endpoint, "get", undefined, headers, params);

const post = <T>(
  endpoint: string,
  body: RequestBody,
  headers?: RequestHeaders
): RequestResponseType<T> => request(endpoint, "post", body, headers);

const remove = <T>(
  endpoint: string,
  body?: RequestBody,
  headers?: RequestHeaders
): RequestResponseType<T> => request(endpoint, "delete", body, headers);

const put = <T>(
  endpoint: string,
  body: RequestBody,
  headers?: RequestHeaders
): RequestResponseType<T> => request(endpoint, "put", body, headers);

export { get, post, remove, put };
