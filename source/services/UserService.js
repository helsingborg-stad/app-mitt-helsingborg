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

        const { autoStartToken, orderRef } = await request(
            'auth',
            { personalNumber, endUserIp }
        ).catch(error => {
            console.log("das error", error);
            console.log(error.response);
            console.log(error.request);
        });

        if (!autoStartToken || !orderRef) {
            return reject(new Error('Missing token or orderref'));
        }

        // Set the order ref
        orderReference = orderRef;
        console.log("orderReference", orderReference);

        // Launch BankID app if it's installed on this machine
        const launchNativeApp = await canOpenUrl('bankid:///');
        console.log("launchNativeApp", launchNativeApp);
        if (launchNativeApp) {
            this.launchBankIdApp(autoStartToken);
        }

        // Poll /collect/ endpoint every 2nd second until auth either success or fails
        const interval = setInterval(async () => {
            const { status, hintCode, completionData, error } = await request(
                'collect',
                { orderRef }
            ).catch(
                error => console.log("Auth collect error", error)
            );

            console.log("status", status);
            console.log("hintCode", hintCode);
            console.log("error", error);

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

export const cancelRequest = async () => {
    console.log("Cancel order: ", orderReference);

    return await request(
        'cancel',
        { orderRef: orderReference }
    ).catch(
        error => console.log(error)
    );
}

/**
 * Make request to BankID API
 * @param {string} method
 * @param {array} params
 */
request = async (method, params) => {
    return await axiosClient.post(
        `${env.BANKID_API_URL}/${method}/`,
        params
    )
        .then(result => {
            console.log(result);
            if (result.data.data) {
                return result.data.data;
            }
            return { error: new Error('Error in request call, missing returned data') };
        })
        .catch(err => {
            console.log('Error in request call');
            console.log("err", err.request);
            return { error: err };
        });
}

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
