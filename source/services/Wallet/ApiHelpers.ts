import env from 'react-native-config';
import axios from 'axios';
import { DecentralizedIdentifier } from './types';

const apiUrl = env.AID_API_URL;
const apiUser = env.AID_USER;
const apiAuthToken = env.AID_AUTH;

/** Wrapper for doing GraphQL requests */
const doGraphQLRequest = async (query: string, variables: Record<string, any>) => {
  const headers = {
    'Content-Type': 'application/json',
    Accept: '*/*',
    Connection: 'keep-alive',
    'Accept-Encoding': 'gzip,deflate,br',
    'user-agent': apiUser,
    authorization: apiAuthToken,
  };
  const data = { query, variables };
  try {
    const response = await axios({
      url: apiUrl,
      headers,
      method: 'post',
      data,
    }).then(r => r);
    if (response?.data?.errors) {
      throw new Error(response.data.errors[0].message);
    }
    return response;
  } catch (error) {
    console.log(error);
    return { message: error.message, ...error.response };
  }
};

/** Generates a new credential encoding the given data, with some default values for expiration time and so on */
export const generateCredential = async (userDID: string, data: Record<string, any>) => {
  const query = `
  mutation newCredential ($req: CredentialRequest) {
    newCredential (req: $req) {
        token
    }
  }`;
  const variables = {
    req: {
      subject: userDID,
      audience: ['mitt-helsingborg'],
      expiration: '720h',
      notBefore: '0s',
      payload: JSON.stringify(data),
    },
  };
  const response: { data: { data: { newCredential: { token: string } } } } = await doGraphQLRequest(
    query,
    variables
  );
  return response.data.data.newCredential.token;
};

/** Validates a given credential (JWT token) */
export const checkCredential = async (credential: string) => {
  const query = `
  query isCredentialValid ($token: String!) {
    isCredentialValid (token: $token)
  }`;
  const variables = {
    token: credential,
  };
  const response: {
    data: {
      data: null | { isCredentialValid: boolean };
      errors: { message: string };
    };
  } = await doGraphQLRequest(query, variables);

  return response.data.data?.isCredentialValid;
};

/** Generates a new decentralized identifier, to be stored on the user */
export const generateUserDID = async () => {
  const query = `
  mutation newIdentifier ($format: DateFormat, $format1: DateFormat, $mode: DocumentMode) {
    newIdentifier {
        id
        authenticationMethods
        created (format: $format)
        updated (format: $format1)
        document (mode: $mode)
    }
  }`;
  const variables = {
    format: 'RFC3339',
    format1: 'RFC3339',
    mode: 'EXPANDED',
  };
  const newUserDID: {
    data: {
      data: { newIdentifier: Omit<DecentralizedIdentifier, 'document'> & { document: string } };
    };
  } = await doGraphQLRequest(query, variables);
  const newId: DecentralizedIdentifier = {
    ...newUserDID.data.data.newIdentifier,
    document: JSON.parse(newUserDID.data.data.newIdentifier.document),
  };
  return newId;
};
