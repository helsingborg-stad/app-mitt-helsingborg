import env from 'react-native-config';
import axios from "axios";

export const authorizeUser = (pno) => {
    const host = env.MYPAGES_API_URL;
    const endpoint = "/auth/";
    const apiUrl = `${host}${endpoint}`;

    const params = {
        pno,
        endUserIp: "0.0.0.0", // TODO: Need a way to capture the user ip address either here or move it to the backend.
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
