import { Linking } from 'react-native';
import { NetworkInfo } from 'react-native-network-info';
import { post, remove } from '../helpers/ApiRequest';
import { buildBankIdClientUrl, canOpenUrl } from '../helpers/UrlHelper';
import StorageService, { ORDER_KEY, TEMP_TOKEN_KEY } from './StorageService';

let cancelled = false;

/**
 * Reset cancel flag
 */
export const resetCancel = () => {
  cancelled = false;
};

/**
 * Open requested URL
 *
 * @param {String} url
 */
const openURL = url =>
  Linking.openURL(url)
    .then(() => true)
    .catch(() => false);

/**
 * Launch BankID app id it's installed on clients machine
 *
 * @param {string} bankIdClientUrl
 */
const launchBankIdApp = async autoStartToken => {
  const bankIdClientUrl = buildBankIdClientUrl(autoStartToken);
  // Launch app if it's installed on this machine
  const canLaunchApp = await canOpenUrl('bankid:///');
  if (canLaunchApp) {
    openURL(bankIdClientUrl);
  }
};

/**
 * Polls collect endpoint every 2nd second until it's resolved
 *
 * @param {String} orderRef Order reference
 * @param {String} token    Access oken
 * @return {Promise}
 */
const collect = async (orderRef, token) =>
  new Promise((resolve, reject) => {
    const interval = setInterval(async () => {
      // Bail if cancel button is triggered by the user
      if (cancelled === true) {
        clearInterval(interval);
        resetCancel();
        resolve({ ok: false, data: 'cancelled' });
      }

      let collectData = {};

      try {
        collectData = await post(
          'auth/bankid/collect',
          { orderRef },
          token ? { Authorization: `Bearer ${token}` } : {}
        );
        collectData = collectData.data.data.attributes;
      } catch (error) {
        clearInterval(interval);
        reject(error);
      }

      const { status, hint_code: hintCode, completion_data: completetionData } = collectData;

      if (status === 'failed') {
        clearInterval(interval);
        resolve({ ok: false, data: hintCode });
      }
      if (status === 'complete') {
        clearInterval(interval);

        if (completetionData.user) {
          const userData = {
            name: completetionData.user.name || '',
            givenName: completetionData.user.given_name || '',
            surname: completetionData.user.surname || '',
            personalNumber: completetionData.user.personal_number || '',
          };

          resolve({
            ok: true,
            data: {
              user: userData,
              token,
            },
          });
        }

        resolve({ ok: false, data: hintCode });
      }
    }, 2000);
  });

/**
 * Make an auth request to BankID API and wait for response
 *
 * @param {string} personalNumber
 * @return {Promise}
 */
export const authAndCollect = async personalNumber => {
  const endUserIp = await NetworkInfo.getIPV4Address(ip => ip);
  let responseJson;

  // Make initial auth request to retrieve user details and access token
  try {
    responseJson = await post('auth/bankid', { personalNumber, endUserIp });
    responseJson = responseJson.data.data.attributes;
  } catch (error) {
    console.log('Auth error', error);
    return Promise.reject(error);
  }

  const { auto_start_token: autoStartToken, order_ref: orderRef, token } = responseJson;
  if (!autoStartToken || !orderRef) {
    return Promise.reject(new Error('Missing autoStartToken or orderRef'));
  }

  // Save order reference + temporary access token to async storage
  await StorageService.saveData(ORDER_KEY, orderRef);
  await StorageService.saveData(TEMP_TOKEN_KEY, token);

  // Launch BankID app if it's installed on the clients machine
  launchBankIdApp(autoStartToken);

  return collect(orderRef, token);
};

/**
 * Makes a sign request to BankID API and wait for response
 *
 * @param {string} personalNumber
 * @param {string} userVisibleData
 * @return {Promise}
 */
export const signAndCollect = async (personalNumber, userVisibleData) => {
  const endUserIp = await NetworkInfo.getIPV4Address(ip => ip);
  const requestBody = {
    personalNumber,
    endUserIp,
    userVisibleData,
  };
  let responseJson = {};

  // Make initial auth request to retrieve order reference
  try {
    responseJson = await post('auth/bankid/sign', requestBody);
    responseJson = responseJson.data.data.attributes;
  } catch (error) {
    console.log('Sign error', error);
    return Promise.reject(error);
  }

  const { auto_start_token: autoStartToken, order_ref: orderRef } = responseJson;
  if (!autoStartToken || !orderRef) {
    return Promise.reject(new Error('Missing autoStartToken or orderRef'));
  }

  // Save order reference to async storage
  await StorageService.saveData(ORDER_KEY, orderRef);

  // Launch BankID app if it's installed on the clients machine
  launchBankIdApp(autoStartToken);

  return collect(orderRef);
};

/**
 * Cancels a started auth BankID request
 * @param {string} order
 */
export const cancelBankidRequest = async request => {
  const orderRef = await StorageService.getData(ORDER_KEY);
  const token = await StorageService.getData(TEMP_TOKEN_KEY);
  const headers = request === 'auth' ? { Authorization: `Bearer ${token}` } : undefined;

  // Stop polling auth/sign requests
  cancelled = true;

  // Send cancel request
  try {
    await remove('auth/bankid/cancel', { orderRef }, headers);
  } catch (err) {
    console.log('Cancel err', err);
  }
};

/**
 * Bypasses the BankID authentication steps
 * @param {string} personalNumber
 */
export const bypassBankid = async personalNumber => ({
  ok: true,
  data: {
    user: {
      name: 'Saruman The White',
      givenName: 'Saruman',
      surname: 'The White',
      personalNumber,
    },
  },
});
