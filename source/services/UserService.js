import env from 'react-native-config';
import axios from "axios";
import { Linking } from 'react-native';
import { NetworkInfo } from 'react-native-network-info';
import { canOpenUrl } from '../helpers/LinkHelper';

/**
 * Launch BankID app
 * @param {string} bankIdClientUrl
 */
launchBankIdApp = async (autoStartToken) => {
    const bankIdClientUrl = this.buildBankIdClientUrl(autoStartToken);
    console.log("bankIdClientUrl", bankIdClientUrl);

    return this.openURL(bankIdClientUrl);
};

/**
 * Builds the BankID client URL
 * @param {string} autoStartToken
 */
buildBankIdClientUrl = (autoStartToken) => {
    const params = `?autostarttoken=${autoStartToken}&redirect=${env.APP_SCHEME}://`;

    // For Android, use url "bankid:///"
    const clientUrl = `https://app.bankid.com/${params}`;
    console.log("clientUrl", clientUrl);

    return clientUrl;
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
export const authorizeUser = (personalNumber) =>
    new Promise(async (resolve, reject) => {

        const endUserIp = await NetworkInfo.getIPAddress(ip => ip);
        const params = {
            personalNumber,
            endUserIp,
        };

        const { autoStartToken, orderRef } = await axiosClient.post(
            `${env.BANKID_API_URL}/auth/`,
            params
        ).then(result => {
            if (result.data.data) {
                console.log("Result", result.data.data);
                return result.data.data;
            } else {
                return new Error('Auth request error')
            }
        }).catch(error => {
            console.log("Error", error);
            console.log("Error request", error.request);
            return error;
        });

        if (!autoStartToken || !orderRef) {
            return reject(new Error('Auth request failed'));
        }

        // Launch BankID app if it's installed on this machine
        const launchNativeApp = await canOpenUrl('bankid:///');
        console.log("launchNativeApp", launchNativeApp);
        if (launchNativeApp) {
            this.launchBankIdApp(autoStartToken);
        }

        // Poll /collect/ endpoint every 2nd second until auth either success or fails
        const interval = setInterval(async () => {
            const { status, hintCode, completionData, error } = await axiosClient.post(
                `${env.BANKID_API_URL}/collect/`,
                { orderRef }
            ).then(result => {
                return result.data.data;
            }).catch(error => {
                // Implement error handling here
                console.log('Error in call');
                console.log(error.request);
                if (error.response && error.response.data) {
                    console.log(error.response.data);
                    if (error.response.data.errorCode === 'alreadyInProgress') {
                        // TODO: Cancel the euqest here
                        console.log('Call cancel on this orderRef before retrying');
                        console.log('The order should now have been automatically cancelled by this retry');
                    }
                }

                return { error: error };
            });

            if (status === 'failed') {
                console.log("Collect failed");
                clearInterval(interval);
                resolve({ ok: false, status: hintCode });
            } else if (status === 'complete') {
                console.log("Collect complete");
                clearInterval(interval);
                resolve({ ok: true, status: completionData });
            } else if (error) {
                console.log("Collect error");
                clearInterval(interval);
                reject(error);
            }

        }, 2000);
    });

const axiosClient = axios.create({
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    }
});

export const bypassBankid = async (pnr) => {
    return {
        'name': 'Gandalf Stål',
        'givenName': 'Gandalf',
        'surname': 'Stål',
        'personalNumber': pnr
    };
};
