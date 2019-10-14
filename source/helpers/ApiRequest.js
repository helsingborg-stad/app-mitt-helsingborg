import axios from "axios";
import StorageService from '../services/StorageService';
import { buildServiceUrl } from './UrlHelper';

export const get = (endpoint = '', headers = undefined) => {
  return request(endpoint, "get", undefined, headers);
}

export const post = (endpoint = '', body = undefined, headers = undefined) => {
  return request(endpoint, "post", body, headers);
}

export const remove = (endpoint = '', body = undefined, headers = undefined) => {
  return request(endpoint, "delete", body, headers);
}

export const put = (endpoint = '', body = undefined, headers = undefined) => {
  return request(endpoint, "put", body, headers);
}

const TOKENKEY = 'accessToken';

/**
 * Axios request
 * @param {string} endpoint
 * @param {string} method
 * @param {obj} data
 * @param {obj} headers
 */
const request = (
  endpoint,
  method,
  data,
  headers
) => {
  return new Promise(async (resolve, reject) => {
    // Build complete api url
    const url = buildServiceUrl(endpoint);
    // Get
    const token = await StorageService.getData(TOKENKEY);
    const bearer = token ? "Bearer " + token : "";

    // Merge custom headers
    headers = {
      ...{
        'Authorization': bearer,
        'Content-Type': 'application/json',
      },
      ...headers
    }

    // Do request
    const req = await axios({
      url,
      method,
      headers,
      data: data !== undefined ? data : undefined,
    })
      .then(res => {
        if (res.status >= 200 && res.status < 400) {
          return resolve(res);
        } else {
          return reject({
            status: res.status,
          });
        }
      })
      .catch(error => {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          return reject(error.response);
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the
          // browser and an instance of
          // http.ClientRequest in node.js
          return reject(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          return reject(error.request);
        }
      });

    return req;
  });
}
