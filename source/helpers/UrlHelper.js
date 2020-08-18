import env from 'react-native-config';
import { Linking, Platform } from 'react-native';

/**
 * Open requested URL
 *
 * @param {String} url
 */
export const openUrl = url =>
  Linking.openURL(url)
    .then(() => true)
    .catch(() => false);

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
  let url = 'bankid:///';
  let queryString = `?autostarttoken=${autoStartToken}&redirect=null`;

  if (Platform.OS === 'ios') {
    url = 'https://app.bankid.com/';
    queryString = `?autostarttoken=${autoStartToken}&redirect=${env.APP_SCHEME}://`;
  }

  return `${url}${queryString}`;
};
