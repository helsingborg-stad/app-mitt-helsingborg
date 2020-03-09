/**
 * Service for all chat and form requests.
 *
 */

import axios from 'axios';
import env from 'react-native-config';
import { post } from '../helpers/ApiRequest';
import StorageService, { TOKEN_KEY } from './StorageService';

const getService = async endpoint => {
  const token = await StorageService.getData(TOKEN_KEY);

  return axios({
    method: 'GET',
    url: `${env.MITTHELSINGBORG_IO}/${endpoint}`,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })
    .then(result => Promise.resolve(result.data))
    .catch(err => {
      console.log('Error in request call', err.request);
      return Promise.reject(err);
    });
};

export const constructGetFormTemplate = async endpoint => {
  try {
    const reqChatResult = await getService(endpoint);

    return Promise.resolve(reqChatResult);
  } catch (error) {
    return Promise.reject(error.message);
  }
};

export const getFormTemplate = formId => {
  const endpoint = `forms/${formId}/questions`;

  return constructGetFormTemplate(endpoint);
};

export const getAllFormTemplates = () => {
  const endpoint = 'form/forms';

  return constructGetFormTemplate(endpoint);
};

export const sendChatMsg = async (
  assistantId,
  textInput,
  context = undefined,
  sessionId = undefined,
  intents = undefined,
  entities = undefined
) => {
  const endpoint = 'chatbot/message';

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

    return Promise.resolve(reqChatResult.data);
  } catch (error) {
    return Promise.reject(error.message);
  }
};
