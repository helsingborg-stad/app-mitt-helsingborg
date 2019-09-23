/**
 * Service for all chat and form requests.
 *
 */

import React from 'react';
import axios from 'axios';
import env from "react-native-config";
import StorageService, { TOKEN_KEY } from "../services/StorageService";

export const getFormTemplate = (formId) => {
    const endpoint = `${env.MITTHELSINGBORG_IO}/form/getFormTemplate/${formId}`;

    return constructGetFormTemplate(endpoint);
};

export const getAllFormTemplates = () => {
    const endpoint = `${env.MITTHELSINGBORG_IO}/form/forms`;

    return constructGetFormTemplate(endpoint);
};

export const constructGetFormTemplate = (endpoint) => {
    return new Promise(async (resolve, reject) => {
        try {
            const token = await StorageService.getData(TOKEN_KEY);
            const reqChatResult = await reqService(endpoint, token);

            return resolve(reqChatResult);
        } catch (error) {
            return reject(error.message);
        }
    })
};

const reqService = async (endpoint, token) => {
    return new Promise(async (resolve, reject) => {
        await axios({
                method: 'GET',
                url: endpoint,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                    // 'Authorization': 'Bearer '
                }
            }
        ).then(result => {
            return resolve(result.data);
        }).catch(err => {
            console.log("Error in request call", err.request);
            return reject(err);
        });
    });
};
