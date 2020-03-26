import { Linking } from 'react-native';
import { NetworkInfo } from 'react-native-network-info';
import { getMessage } from 'app/helpers/MessageHelper';
import { get, post, remove } from '../helpers/ApiRequest';
import { buildBankIdClientUrl, canOpenUrl } from '../helpers/UrlHelper';
import StorageService, { ORDER_KEY, TEMP_TOKEN_KEY } from './StorageService';
import UserMockData from '../assets/mock/user';

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
  new Promise((resolve, _reject) => {
    const interval = setInterval(async () => {
      // Bail if cancel button is triggered by the user
      if (cancelled === true) {
        clearInterval(interval);
        resetCancel();
        resolve({ ok: false, data: getMessage('userCancel') });
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
        console.log('Collect error: ', error.message);
        resolve({ ok: false, data: getMessage('unknownError') });
      }

      const { status, hint_code: hintCode, completion_data: completetionData } = collectData;

      if (status === 'failed') {
        clearInterval(interval);
        resolve({ ok: false, data: getMessage(hintCode) });
      }
      if (status === 'complete') {
        clearInterval(interval);

        if (completetionData.user) {
          resolve({
            ok: true,
            data: {
              user: completetionData.user,
              token,
            },
          });
        }

        resolve({ ok: false, data: getMessage(hintCode) });
      }
    }, 1050);
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
    console.log('Auth error:', error);
    return Promise.resolve({ ok: false, data: getMessage('technicalError') });
  }

  const { auto_start_token: autoStartToken, order_ref: orderRef, token } = responseJson;
  if (!autoStartToken || !orderRef) {
    console.log('Auth error: Missing autoStartToken or orderRef');
    return Promise.resolve({ ok: false, data: getMessage('technicalError') });
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
    console.log('Sign error:', error);
    return Promise.resolve({ ok: false, data: getMessage('technicalError') });
  }

  const { auto_start_token: autoStartToken, order_ref: orderRef } = responseJson;
  if (!autoStartToken || !orderRef) {
    console.log('Sign error: Missing autoStartToken or orderRef');
    return Promise.resolve({ ok: false, data: getMessage('technicalError') });
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
 * Returns mock user data
 */
export const getMockUser = () => ({ ...UserMockData.user });

/**
 * Create user object with data collected from user database
 * TODO: Temporary fix, remove when data structure is done in db
 * @param {object} data User object data
 * @return {object}
 */
const createUserObject = data => ({
  mobilePhone: data.mobile_phone || null,
  address: {
    street: data.adress.street || null,
    postalCode: data.adress.postal_code || null,
  },
  lastName: data.last_name || null,
  personalNumber: data.personal_number || null,
  civilStatus: data.civil_status || null,
  createdAt: data.created_at || null,
  uuid: data.uuid || null,
  email: data.email || null,
  firstName: data.first_name || null,
});

/**
 * Get user from database
 * @param {string} personalNumber Personal identoty number
 * @return {promise}
 */
export const getUser = async personalNumber => {
  try {
    let response = await get(`user/${personalNumber}`);
    response = response.data.data.attributes.item;
    return Promise.resolve({ ok: true, data: createUserObject(response) });
  } catch (error) {
    console.log('Get user error:', error);
    return Promise.resolve({ ok: false, data: getMessage('unknownError') });
  }
};
