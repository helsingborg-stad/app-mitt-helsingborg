/**
 * Service for all chat and form requests.
 *
 */

import React from 'react';
import axios from 'axios';
import env from 'react-native-config';
import { get, post } from '../helpers/ApiRequest';
import StorageService, { TOKEN_KEY } from './StorageService';

export const getFormTemplate = formId => {
  const endpoint = `forms/${formId}/questions`;

  return constructGetFormTemplate(endpoint);
};

export const getAllFormTemplates = () => {
  const endpoint = 'form/forms';

  return constructGetFormTemplate(endpoint);
};

export const constructGetFormTemplate = endpoint =>
  new Promise(async (resolve, reject) => {
    try {
      const reqChatResult = await getService(endpoint);

      return resolve(reqChatResult);
    } catch (error) {
      return reject(error.message);
    }
  });

export const sendChatMsg = async (
  assistantId,
  textInput,
  context = undefined,
  sessionId = undefined,
  intents = undefined,
  entities = undefined
) => {
  const endpoint = 'chatbot/message';

  return new Promise(async (resolve, reject) => {
    const data = {
      assistantId,
      textInput,
    };

    if (sessionId) {
      data.sessionId = sessionId;
    }

    if (context) {
      data.context = context;
    }

    if (intents) {
      data.intents = intents;
    }

    if (entities) {
      data.entities = entities;
    }

    try {
      const reqChatResult = await post(endpoint, data);

      return resolve(reqChatResult.data);
    } catch (error) {
      return reject(error.message);
    }
  });
};

const postService = async (endpoint, data, token) =>
  new Promise(async (resolve, reject) => {
    await axios({
      method: 'POST',
      url: `${env.MITTHELSINGBORG_IO}/${endpoint}`,
      data,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then(result => resolve(result.data))
      .catch(err => {
        console.log('Error in request call', err.request);
        return reject(err);
      });
  });

const getService = async endpoint =>
  new Promise(async (resolve, reject) => {
    const token = await StorageService.getData(TOKEN_KEY);

    await axios({
      method: 'GET',
      url: `${env.MITTHELSINGBORG_IO}/${endpoint}`,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then(result => resolve(result.data))
      .catch(err => {
        console.log('Error in request call', err.request);
        return reject(err);
      });
  });
