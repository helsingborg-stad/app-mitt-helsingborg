/**
 * Service for all chat and form requests.
 *
 */

import React from 'react';
import { get, post } from '../helpers/ApiRequest';

export const getFormTemplate = (formId) => {
  const endpoint = `form/getFormTemplate/${formId}`;

  return constructGetFormTemplate(endpoint);
};

export const getAllFormTemplates = () => {
  const endpoint = 'form/forms';

  return constructGetFormTemplate(endpoint);
};

export const constructGetFormTemplate = (endpoint) => {
  return new Promise(async (resolve, reject) => {
    try {
      const reqChatResult = await get(endpoint);
      console.log("reqChatResult", reqChatResult);

      return resolve(reqChatResult.data);
    } catch (error) {
      return reject(error.message);
    }
  })
};

export const sendChatMsg = async (workspaceId, textInput) => {
  const endpoint = 'chatbot/message';

  return new Promise(async (resolve, reject) => {
    const data = {
      workspaceId,
      textInput
    };

    try {
      const reqChatResult = await post(endpoint, data);
      console.log("reqChatResult", reqChatResult);

      return resolve(reqChatResult.data);
    } catch (error) {
      return reject(error.message);
    }
  })
};
