import env from 'react-native-config';
import axios from "axios";
import { Linking } from 'react-native';
import { NetworkInfo } from 'react-native-network-info';
import { canOpenUrl } from '../helpers/LinkHelper';

let orderReference = '';

/**
 * Launch BankID app
 * @param {string} bankIdClientUrl
 */
launchBankIdApp = async (autoStartToken) => {
    const bankIdClientUrl = this.buildBankIdClientUrl(autoStartToken);

    return this.openURL(bankIdClientUrl);
};

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

/**
 * Open requested URL
 * @param {string} url
 */
openURL = (url) => {
    return Linking.openURL(url)
        .then(() => true)
        .catch(() => false);
};

/**
 * Make an auth request to BankID API and poll until done
 * @param {string} personalNumber
 */
export const authorize = (personalNumber) =>
    new Promise(async (resolve, reject) => {
        const endUserIp = await NetworkInfo.getIPAddress(ip => ip);

        const { autoStartToken, orderRef } = await request(
            'auth',
            { personalNumber, endUserIp }
        ).catch(error => {
            console.log("Auth error", error);
        });

        if (!autoStartToken || !orderRef) {
            return reject(new Error('Missing token or orderref'));
        }

        // Set the order reference
        orderReference = orderRef;

        // Launch BankID app if it's installed on this machine
        const launchNativeApp = await canOpenUrl('bankid:///');
        if (launchNativeApp) {
            this.launchBankIdApp(autoStartToken);
        }

        // Poll /collect/ endpoint every 2nd second until auth either success or fails
        const interval = setInterval(async () => {
            const { status, hintCode, completionData, errorCode, error } = await request(
                'collect',
                { orderRef }
            ).catch(
                error => console.log("Auth collect error", error)
            );

            if (status === 'failed') {
                clearInterval(interval);
                resolve({ ok: false, data: hintCode });
            } else if (status === 'complete') {
                clearInterval(interval);
                resolve({ ok: true, data: completionData.user });
            } else if (errorCode) {
                // Probably has the user clicked abort login in the app
                clearInterval(interval);
                resolve({ ok: false, data: errorCode });
            } else if (error) {
                clearInterval(interval);
                reject(error);
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
        const { autoStartToken, orderRef } = await request(
            'sign', {
                personalNumber,
                endUserIp,
                userVisibleData,
            }
        ).catch(error => {
            console.log("Sign error", error);
        });

        if (!autoStartToken || !orderRef) {
            return reject(new Error('Missing token or orderref'));
        }

        // Set the order ref
        orderReference = orderRef;

        // Launch BankID app if it's installed on this machine
        const launchNativeApp = await canOpenUrl('bankid:///');
        if (launchNativeApp) {
            this.launchBankIdApp(autoStartToken);
        }

        // Poll /collect/ endpoint every 2nd second until sign either success or fails
        const interval = setInterval(async () => {
            const { status, hintCode, completionData, errorCode, error } = await request(
                'collect',
                { orderRef }
            ).catch(
                error => console.log("Auth collect error", error)
            );

            if (status === 'failed') {
                clearInterval(interval);
                resolve({ ok: false, data: hintCode });
            } else if (status === 'complete') {
                clearInterval(interval);
                resolve({ ok: true, data: completionData.user });
            } else if (errorCode) {
                // Probably has the user clicked abort login in the app
                clearInterval(interval);
                resolve({ ok: false, data: errorCode });
            } else if (error) {
                clearInterval(interval);
                reject(error);
            }

        }, 2000);
    });

/**
 * Cancels a started BankID request
 * @param {string} order
 */
export const cancelRequest = async (order) => {
    const orderRef = order ? order : orderReference;

    return await request(
        'cancel',
        { orderRef }
    ).catch(
        error => console.log(error)
    );
}

/**
 * Send request to BankID API
 * @param {string} method
 * @param {array} params
 */
request = async (method, params) => {
    return await axiosClient.post(
        `${env.BANKID_API_URL}/${method}/`,
        params
    ).then(result => {
        if (result.data.data) {
            return result.data.data;
        }
        return { error: new Error('Error in request call, missing returned data') };
    }).catch(err => {
        console.log("Error in request call", err.request);
        return { error: err };
    });
}

/**
 * Creates an Axios request client
 */
const axiosClient = axios.create({
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    }
});

/**
 * Bypasses the BankID authentication steps
 * @param {string} personalNumber
 */
export const bypassBankid = async (personalNumber) => {
    return {
        ok: true,
        data: {
            'name': 'Gandalf Stål',
            'givenName': 'Gandalf',
            'surname': 'Stål',
            'personalNumber': personalNumber
        }
    };
};
