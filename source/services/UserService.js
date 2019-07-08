import env from 'react-native-config';
import axios from "axios";
import { Linking } from 'react-native';
import { NetworkInfo } from 'react-native-network-info';
import { canOpenUrl } from '../helpers/LinkHelper';
import StorageService from './StorageService';

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

        const { user, token } = await request(
            'auth',
            {
                personalNumber,
                endUserIp
            }
        ).catch(error => {
            console.log("Auth error", error);
        });

        const { autoStartToken, orderRef } = user;

        if (!user || !autoStartToken || !orderRef) {
            return reject(new Error('Missing autoStartToken or orderRef'));
        }

        // Save order reference to async storage
        StorageService.saveData('orderRef', orderRef);

        // Launch BankID app if it's installed on this machine
        const launchNativeApp = await canOpenUrl('bankid:///');
        if (launchNativeApp) {
            this.launchBankIdApp(autoStartToken);
        }

        // Poll /collect/ endpoint every 2nd second until auth either success or fails
        const interval = setInterval(async () => {
            const collectData = await request(
                `auth/${orderRef}`,
                { orderRef },
                token
            ).catch(
                error => console.log("Auth collect error", error)
            );

            console.log("collectData", collectData);

            const { error } = collectData;
            const { status, hintCode, completionData } = collectData.data;

            // TODO: Fix error handling when mitt-helsingborg-io API is done

            if (status === 'failed') {
                clearInterval(interval);
                resolve({ ok: false, data: hintCode });
            } else if (status === 'complete') {
                clearInterval(interval);
                resolve({
                    ok: true,
                    data: {
                        user: completionData.user,
                        accessToken: token
                    }
                });
            } else if (error) {
                clearInterval(interval);
                reject(error);
            }

        }, 2000);
    });

/**
 * TODO: Fix Sign request when API is done
* Make a sign request to BankID API and poll until done
* @param {string} personalNumber
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
            const collectData = await request(
                'collect',
                { orderRef }
            ).catch(
                error => console.log("Auth collect error", error)
            );

            const { status, hintCode, completionData } = collectData.user;

            if (status === 'failed') {
                clearInterval(interval);
                resolve({ ok: false, data: hintCode });
            } else if (status === 'complete') {
                clearInterval(interval);
                resolve({ ok: true, data: completionData });
            } else if (errorCode) {
                // Probably has the user clicked abort login in the app
                clearInterval(interval);
                resolve({ ok: false, data: errorCode });
            } else if (error) {
                console.log(hintCode);
            }

        }, 2000);
    });
*/

/**
 * Cancels a started BankID request
 * TODO: Fix the cancel endpoint when API is done
 * @param {string} order
 */
export const cancelRequest = async () => {
    const orderRef = await StorageService.getData('orderRef');

    return await request(
        'cancel',
        { orderRef }
    ).catch(
        error => console.log(error)
    );
}

/**
 * Send request to BankID API
 * @param {string} endpoint
 * @param {array} params
 */
request = async (endpoint, data, token) => {
    console.log("data", data);
    return await axios({
        method: 'POST',
        url: `${env.MITTHELSINGBORG_IO}/${endpoint}`,
        data: data,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    }
    ).then(result => {
        console.log("Request result", result);
        return result.data;
    }).catch(err => {
        console.log("Error in request call", err.request);
        return { error: err };
    });
}

/**
 * Bypasses the BankID authentication steps
 * @param {string} personalNumber
 */
export const bypassBankid = async (personalNumber) => {
    return {
        ok: true,
        data: {
            user: {
                'name': 'Gandalf Stål',
                'givenName': 'Gandalf',
                'surname': 'Stål',
                'personalNumber': personalNumber
            },
        }
    }
};
