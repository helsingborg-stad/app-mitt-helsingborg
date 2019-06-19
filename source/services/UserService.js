import env from 'react-native-config';
import axios from "axios";
import { Linking } from 'react-native';
import { NetworkInfo } from 'react-native-network-info';

/**
 * Open BankID app
 * @param {string} bankIdClientUrl
 */
openBankId = (autoStartToken = null) => {
    const bankIdClientUrl = this.buildBankIdClientUrl(autoStartToken);
    console.log(bankIdClientUrl);

    return this.openURL(bankIdClientUrl);
};

/**
 * Builds the BankID client URL
 */
buildBankIdClientUrl = (autoStartToken = null) => {
    let params = autoStartToken ? `?autostarttoken=<${autoStartToken}>` : '';
    params += params ? `&redirect=${env.APP_SCHEME}://` : `?redirect=${env.APP_SCHEME}://`;

    // For Android, use url "bankid:///"
    const clientUrl = `https://app.bankid.com/${params}`;
    console.log("clientUrl", clientUrl);

    return clientUrl;
};

/**
 * Open requested URL
 */
openURL = (url) => {
    return Linking.openURL(url)
        .then(() => true)
        .catch(() => false);
};

/**
 * Make a request to BankID API.
 * Used to trigger BankID from other devices.
 *
 * TODO:
 * Change the auth flow:
 * - When BankID is installed, make auth request first to get 'atuostarttoken'
 * - Then, open bankid app including 'atuostarttoken'
 * - Fix redirect param, it breaks when autostarttoken is added to url
 *
 * @param {string} pno
 */
export const authorizeUser = async (pno) => {
    const host = env.MYPAGES_API_URL;
    const endpoint = "/auth/";
    const apiUrl = `${host}${endpoint}`;
    const ipAddress = await NetworkInfo.getIPAddress(ip => ip);

    const params = {
        pno,
        endUserIp: ipAddress,
    };

    console.log("apiUrl", apiUrl);
    console.log('params', params);

    // Test if BankID is installed
    Linking.canOpenURL('bankid:///')
        .then((supported) => {
            if (supported) {
                console.log("BankID app is installed");
                // const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwbm8iOiIxOTU3MTEyNjA2MjkiLCJpYXQiOjE1NjA4NTgzNDQsImV4cCI6MTU2MDk0NDc0NH0.qOEKtIG8wMgjN_RlWF7KuRFU85Tc1nrxBtUXeqG8aBQ';
                // this.openBankId(token);
                this.openBankId();
            } else {
                console.log("BankID is not installed");
            }
        })
        .catch((err) => console.error('An error occurred', err));

    return axiosClient.post(
        apiUrl,
        params
    )
        .then(result => {
            console.log("Result", result);
            return Promise.resolve(result);
        })
        .catch(error => {
            console.log("Error", error);
            console.log("Error request", error.request);

            return Promise.reject(error);
        });
};


const axiosClient = axios.create({
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    }
});

export const bypassBankid = async (pno) => {
    return {
        'name': 'Gandalf Stål',
        'givenName': 'Gandalf',
        'surname': 'Stål',
        'personalNumber': pno
    };
};
