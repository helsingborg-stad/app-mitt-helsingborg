import { Linking } from 'react-native';
import { NetworkInfo } from 'react-native-network-info';
import { getMessage } from 'app/helpers/MessageHelper';
import { buildBankIdClientUrl, canOpenUrl } from '../helpers/UrlHelper';
import { get, post } from '../helpers/ApiRequest';

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
 * Function for polling the status in a BankID authentication process.
 * @param {string} orderRef A valid BankID order reference
 */
async function collect(orderRef) {
  try {
    const { data, status } = await post('auth/bankid/collect', { orderRef });
    if (status === 502) {
      // Status 502 is a connection timeout error,
      // may happen when the connection was pending for too long,
      // and the remote server or a proxy closed it
      // let's reconnect
      await collect(orderRef);
    } else if (status === 200 && data && data.data.status === 'pending') {
      // Reconnect in one 1050 ms
      await new Promise(resolve => setTimeout(resolve, 1050));
      await collect(orderRef);
    } else if (status === 200 && data && data.data.status === 'failed') {
      return { success: false, data: getMessage(data.data.hintCode) };
    } else if (status === 404) {
      return { success: false, data: getMessage('userCancel') };
    } else {
      return { success: true, data: data.data };
    }
  } catch (error) {
    console.error(`BankID Collect Error: ${error}`);
    return { success: false, data: getMessage('unkownError') };
  }
}
/**
 * Function for handling a BankID Authentication request.
 * @param {string} ssn A Swedish Social Security Number.
 */
async function auth(ssn) {
  const endUserIp = await NetworkInfo.getIPV4Address(ip => ip);
  try {
    const response = await post('auth/bankid/auth', { personalNumber: ssn, endUserIp });
    if (response.status === 400) {
      await auth(ssn);
    } else {
      return { success: true, data: response.data.data.attributes };
    }
  } catch (error) {
    console.error(`BankID Auth Error: ${error}`);
    return { success: false, data: getMessage('technicalError') };
  }
}

async function cancel(orderRef) {
  try {
    await post('auth/bankid/cancel', { orderRef });
    return { success: true };
  } catch (err) {
    console.error('BankID Cancel Error', err);
    return { success: false, data: getMessage('technicalError') };
  }
}

async function sign(ssn, userVisibleData) {
  const endUserIp = await NetworkInfo.getIPV4Address(ip => ip);
  const requestBody = {
    personalNumber: ssn,
    endUserIp,
    userVisibleData,
  };

  try {
    const { data } = await post('auth/bankid/sign', requestBody);
    return { success: true, data: data.data.attributes };
  } catch (error) {
    console.error('BankID Sign Error:', error);
    return { success: false, data: getMessage('technicalError') };
  }
}

/**
 * Launch BankID app on device
 *
 * @param {string} autoStartToken Token retrived from a bankid auth request.
 */
const launchApp = async autoStartToken => {
  const bankIdClientUrl = buildBankIdClientUrl(autoStartToken);
  // Launch app if it's installed on this machine
  const canLaunchApp = await canOpenUrl('bankid:///');
  if (canLaunchApp) {
    openURL(bankIdClientUrl);
  }
};

const bankid = {
  auth,
  collect,
  cancel,
  sign,
  launchApp,
};

export default bankid;
