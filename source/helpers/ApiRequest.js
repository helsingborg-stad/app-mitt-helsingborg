import axios from "axios";
import { Platform } from "react-native";
import StorageService, { ACCESS_TOKEN_KEY } from "../services/StorageService";
import { buildServiceUrl } from "./UrlHelper";
import { name, version } from "../../package.json";
import EnvironmentConfigurationService from "../services/EnvironmentConfigurationService";
import { getUserFriendlyAppVersion } from "./Misc";

/**
 * Axios request
 * User ID will overwrite bearer token in header.
 *
 * @param {string} endpoint
 * @param {string} method
 * @param {obj} data
 * @param {obj} headers
 */
const request = async (endpoint, method, data, headers, params) => {
  const url = await buildServiceUrl(endpoint);
  const token = await StorageService.getData(ACCESS_TOKEN_KEY);
  const { apiKey } =
    EnvironmentConfigurationService.getInstance().activeEndpoint;

  const friendlyVersion = getUserFriendlyAppVersion();

  const userAgent = `${name}/${friendlyVersion}/${Platform.OS}/${Platform.Version}`;

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

const get = (endpoint = "", headers, params) =>
  request(endpoint, "get", undefined, headers, params);

const post = (endpoint = "", body, headers) =>
  request(endpoint, "post", body, headers);

const remove = (endpoint = "", body, headers) =>
  request(endpoint, "delete", body, headers);

const put = (endpoint = "", body, headers) =>
  request(endpoint, "put", body, headers);

const patch = (endpoint = "", body, headers) =>
  request(endpoint, "patch", body, headers);

export { get, post, remove, put, patch };
