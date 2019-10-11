import env from 'react-native-config';
import { Linking } from 'react-native';

/**
 * Test if URL can be opened
 * @param {string} url
 */
export const canOpenUrl = (url) => {
  return Linking.canOpenURL(url)
    .then((supported) => {
      if (supported) {
        return true;
      } else {
        return false;
      }
    })
    .catch((err) => {
      console.error('An error occurred', err);
      return false;
    });
}

/**
 * Builds a service request url
 * @param {string} endpoint
 * @param {obj} params
 */
export const buildServiceUrl = (endpoint = '', params = {}) => {
  let queryParams = { apikey: env.MITTHELSINGBORG_IO_APIKEY || '' };
  // Concatenate params
  queryParams = { ...params, ...queryParams }
  // Build query url
  queryUrl = encodeQueryData(queryParams);
  // Trim slashes
  endpoint = endpoint.replace(/^\/|\/$/g, '');
  // Build url
  const url = `${env.MITTHELSINGBORG_IO}/${endpoint}?${queryUrl}`;

  return url;
}

/**
 *
 * @param {obj} queryParams
 */
const encodeQueryData = (queryParams) => {
  const data = [];
  for (let d in queryParams) {
    data.push(encodeURIComponent(d) + '=' + encodeURIComponent(queryParams[d]));
  }

  return data.join('&');
}

/**
 * Builds the BankID client URL
 * @param {string} autoStartToken
 */
buildBankIdClientUrl = (autoStartToken) => {
  const params = `?autostarttoken=${autoStartToken}&redirect=${env.APP_SCHEME}://`;
  const androidUrl = 'bankid:///';
  const iosUrl = 'https://app.bankid.com/';

  return `${iosUrl}${params}`;
};
