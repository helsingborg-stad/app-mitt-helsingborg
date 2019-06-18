import env from 'react-native-config';
import axios from "axios";
import { Linking } from 'react-native';
import { NetworkInfo } from 'react-native-network-info';

/**
 * Open BankID app
 * @param {string} bankIdClientUrl
 */
export const openBankId = (autoStartToken = null) => {
    const bankIdClientUrl = this.buildBankIdClientUrl(autoStartToken);
    console.log(bankIdClientUrl);

    return this.openURL(bankIdClientUrl);
};

/**
 * Builds the BankID client URL
 */
buildBankIdClientUrl = (autoStartToken = null) => {
    let params = autoStartToken ? `?autostarttoken=${autoStartToken}` : '';
    params += params ? `&redirect=${env.APP_SCHEME}://` : `?redirect=${env.APP_SCHEME}://`;

    const clientUrl = `bankid:///${params}`;

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
