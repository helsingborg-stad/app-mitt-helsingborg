import env from 'react-native-config';
import JwtDecode from 'jwt-decode';
import StorageService, { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from './StorageService';
import { post, get } from '../helpers/ApiRequest';
import { getMessage } from '../helpers/MessageHelper';

/**
 * This function retrives the accessToken from AsyncStorage and decodes it.
 */
export async function getAccessTokenFromStorage() {
  try {
    const accessToken = await StorageService.getData(ACCESS_TOKEN_KEY);
    const decodedAccessToken = accessToken && JwtDecode(accessToken);
    if (decodedAccessToken) {
      return {
        accessToken,
        ...decodedAccessToken,
      };
    }
  } catch (error) {
    console.error(error);
    return null;
  }
}

/**
 * This function saves the accessToken and it's expire time to AsyncStorage, and also optionally the refresh token.
 * @param {string} accessToken json web token;
 * @param {string} refreshToken json web token, optional;
 */
export async function saveTokensToStorage(accessToken, refreshToken) {
  try {
    await StorageService.saveData(ACCESS_TOKEN_KEY, accessToken);
    if (refreshToken) {
      StorageService.saveData(REFRESH_TOKEN_KEY, refreshToken);
    }
    // TODO: Add real expired at time from token.
    const decodedAccessToken = JwtDecode(accessToken);
    const expiresAt = JSON.stringify(decodedAccessToken.exp * 10000 + new Date().getTime());
    await StorageService.saveData('expiresAt', expiresAt);
    return {
      accessToken,
      ...decodedAccessToken,
    };
  } catch (error) {
    console.error(error);
    return error;
  }
}
/**
 * This function removes the accessToken from AsyncStorage.
 * @param {string} accessToken json web token;
 */
export async function removeAccessTokenFromStorage() {
  await StorageService.removeData(ACCESS_TOKEN_KEY);
}

/**
 * This function tries to grant an accessToken from the AWS authorization endpoint.
 * @param {string} authorizationCode a jwt token that grants access and refresh token
 */
export async function grantAccessToken(authorizationCode) {
  try {
    const response = await post('/auth/token', {
      grant_type: 'authorization_code',
      code: authorizationCode,
    });

    if (response.status !== 200) {
      throw new Error(response.data);
    }
    const { accessToken, refreshToken } = response.data.data.attributes;
    const decodedAccessToken = await saveTokensToStorage(accessToken, refreshToken);
    return [decodedAccessToken, null];
  } catch (error) {
    console.error(error);
    return [null, error];
  }
}

export async function refreshTokens() {
  try {
    const oldRefreshToken = await StorageService.getData(REFRESH_TOKEN_KEY);
    const response = await post(
      '/auth/token',
      {
        grant_type: 'refresh_token',
        refresh_token: oldRefreshToken,
      },
      { 'x-api-key': env.MITTHELSINGBORG_IO_APIKEY }
    );

    if (response.status !== 200) {
      throw new Error(response.data);
    }
    const { accessToken, refreshToken } = response.data.data.attributes;
    const decodedAccessToken = await saveTokensToStorage(accessToken, refreshToken);
    return [decodedAccessToken, null];
  } catch (error) {
    console.error(error);
    return [null, error];
  }
}

async function wait(ms = 1000) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
async function poll(fn, condition, ms) {
  let result = await fn();
  while (condition(result)) {
    // eslint-disable-next-line no-await-in-loop
    await wait(ms);
    // eslint-disable-next-line no-await-in-loop
    result = await fn();
  }
  return result;
}

/**
 * Function for retriving a user.
 * @param {string} accessToken json web token
 */
export async function getUserProfile(accessToken) {
  try {
    const decodedToken = JwtDecode(accessToken);
    if (!decodedToken || !decodedToken.personalNumber) {
      throw new Error('Invalid JWT token');
    }

    if (decodedToken && decodedToken.personalNumber) {
      let timesRun = 0;

      const response = await poll(
        function () {
          timesRun += 1;
          return get(`/users/${decodedToken.personalNumber}`, {
            Authorization: accessToken,
          });
        },
        (response) => timesRun < 5 && response.status !== 200,
        1000
      );

      if (response.status === 200) {
        return [response.data.data.attributes.item, null];
      }

      if (response.status === 404) {
        throw new Error('404, no such user found');
      }

      throw new Error(getMessage('unkownError'));
    }
  } catch (error) {
    return [null, error];
  }
}
