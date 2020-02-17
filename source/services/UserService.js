/* eslint-disable no-unused-vars */
/* eslint-disable no-async-promise-executor */
/* eslint-disable camelcase */
/* eslint-disable no-undef */
import { Linking } from 'react-native';
import { NetworkInfo } from 'react-native-network-info';
import { canOpenUrl, buildServiceUrl, buildBankIdClientUrl } from '../helpers/UrlHelper';
import StorageService, { TEMP_TOKEN_KEY, ORDER_KEY } from './StorageService';
import { remove, post } from '../helpers/ApiRequest';

let cancelled = false;

/**
 * Reset cancel flag
 */
export const resetCancel = () => {
  cancelled = false;
};

/**
 * Launch BankID app
 * @param {string} bankIdClientUrl
 */
launchBankIdApp = async autoStartToken => {
  const bankIdClientUrl = buildBankIdClientUrl(autoStartToken);

  return this.openURL(bankIdClientUrl);
};

/**
 * Open requested URL
 * @param {string} url
 */
openURL = url =>
  Linking.openURL(url)
    .then(() => true)
    .catch(() => false);

/**
 * Make an auth request to BankID API and poll until done
 * @param {string} personalNumber
 */
export const authorize = personalNumber =>
  new Promise(async (resolve, reject) => {
    const endUserIp = await NetworkInfo.getIPAddress(ip => ip);
    let responseJson;

    // Make initial auth request to retrieve user details and access token
    try {
      responseJson = await post('auth/bankid', { personalNumber, endUserIp });
      responseJson = responseJson.data.data.attributes;
    } catch (error) {
      console.log('Auth error', error);
      return reject(error);
    }

    const { auto_start_token, order_ref, token } = responseJson;

    if (!auto_start_token || !order_ref) {
      return reject(new Error('Missing auto_start_token or order_ref'));
    }

    // Save order reference + temporary access token to async storage
    StorageService.saveData(ORDER_KEY, order_ref);
    StorageService.saveData(TEMP_TOKEN_KEY, token);

    // Launch BankID app if it's installed on this machine
    const launchNativeApp = await canOpenUrl('bankid:///');
    if (launchNativeApp) {
      this.launchBankIdApp(auto_start_token);
    }

    // Poll /collect/ endpoint every 2nd second until auth either success or fails
    const interval = setInterval(async () => {
      // Bail if cancel button is triggered by the user
      if (cancelled === true) {
        clearInterval(interval);
        resetCancel();
        return resolve({ ok: false, data: 'cancelled' });
      }

      let collectData = {};

      try {
        collectData = await post(
          'auth/bankid/collect',
          { orderRef: order_ref },
          { Authorization: `Bearer ${token}` }
        );
        collectData = collectData.data.data.attributes;
      } catch (error) {
        clearInterval(interval);
        reject(error);
      }

      const { status, hint_code, completion_data } = collectData;

      if (status === 'failed') {
        clearInterval(interval);
        resolve({ ok: false, data: hint_code });
      } else if (status === 'complete') {
        clearInterval(interval);

        if (completion_data.user) {
          resolve({
            ok: true,
            data: {
              user: completion_data.user,
              accessToken: token,
            },
          });
        }

        resolve({ ok: false, data: hint_code });
      }
    }, 2000);
  });

/**
 * Make a sign request to BankID API and poll until done
 * @param {string} personalNumber
 */
export const sign = (personalNumber, userVisibleData) =>
  new Promise(async (resolve, reject) => {
    const endUserIp = await NetworkInfo.getIPAddress(ip => ip);
    const reqBody = {
      personalNumber,
      endUserIp,
      userVisibleData,
    };
    let responseJson = {};

    // Make initial auth request to retrieve user details and access token
    try {
      responseJson = await post('auth/bankid/sign', reqBody);
      responseJson = responseJson.data.data.attributes;
    } catch (error) {
      console.log('Sign error', error);
      return reject(error);
    }

    const { auto_start_token, order_ref } = responseJson;

    if (!auto_start_token || !order_ref) {
      return reject(new Error('Missing auto_start_token or order_ref'));
    }

    // Save order reference to async storage
    StorageService.saveData(ORDER_KEY, order_ref);

    // Launch BankID app if it's installed on this machine
    const launchNativeApp = await canOpenUrl('bankid:///');
    if (launchNativeApp) {
      this.launchBankIdApp(autoStartToken);
    }

    // Poll /collect/ endpoint every 2nd second until auth either success or fails
    const interval = setInterval(async () => {
      // Bail if cancel button is triggered by the user
      if (cancelled === true) {
        clearInterval(interval);
        resetCancel();
        return resolve({ ok: false, data: 'cancelled' });
      }

      let collectData = {};

      try {
        collectData = await post('auth/bankid/collect', { orderRef: order_ref });
        collectData = collectData.data.data.attributes;
      } catch (error) {
        clearInterval(interval);
        reject(error);
      }

      const { status, hint_code, completion_data } = collectData;

      if (status === 'failed') {
        clearInterval(interval);
        resolve({ ok: false, data: hint_code });
      } else if (status === 'complete') {
        clearInterval(interval);

        if (completion_data.user) {
          resolve({
            ok: true,
            data: {
              user: completion_data.user,
            },
          });
        }

        resolve({ ok: false, data: hint_code });
      }
    }, 2000);
  });

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
      name: 'Saruman Stål',
      givenName: 'Saruman',
      surname: 'Stål',
      personalNumber,
    },
  },
});
