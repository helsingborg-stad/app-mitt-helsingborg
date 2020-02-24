import env from 'react-native-config';
import { Linking } from 'react-native';

/**
 * Test if URL can be opened
 * @param {string} url
 */
export const canOpenUrl = url =>
  Linking.canOpenURL(url)
    .then(supported => {
      if (supported) {
        return true;
      }
      return false;
    })
    .catch(err => {
      console.error('An error occurred', err);
      return false;
    });

/**
 * Build query URL
 * @param {obj} queryParams
 */
const encodeQueryData = queryParams => {
  const data = [];
  const entries = Object.entries(queryParams);
  entries.forEach(([key, value]) => {
    data.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
  });

  return data.join('&');
};

/**
 * Builds a service request url
 * @param {string} endpoint
 * @param {obj} params
 */
export const buildServiceUrl = (endpoint = '', params = {}) => {
  let queryParams = { apikey: env.MITTHELSINGBORG_IO_APIKEY || '' };
  // Concatenate params
  queryParams = { ...params, ...queryParams };
  // Build query url
  const queryString = encodeQueryData(queryParams);
  // Trim slashes
  const sanitizedEndpoint = endpoint.replace(/^\/|\/$/g, '');
  // Build url
  const completeUrl = `${env.MITTHELSINGBORG_IO}/${sanitizedEndpoint}?${queryString}`;

  return completeUrl;
};

/**
 * Builds the BankID client URL
 * @param {string} autoStartToken
 */
export const buildBankIdClientUrl = autoStartToken => {
  const params = `?autostarttoken=${autoStartToken}&redirect=${env.APP_SCHEME}://`;
  /** const androidUrl = 'bankid:///'; <-- Use for android */
  const iosUrl = 'https://app.bankid.com/';

  return `${iosUrl}${params}`;
};
