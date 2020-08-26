import env from 'react-native-config';
import JwtDecode from 'jwt-decode';
import StorageService, { TOKEN_KEY } from 'app/services/StorageService';
import { post, get } from 'app/helpers/ApiRequest';

/**
 * This function retrives the accessToken from AsyncStorage and decodes it.
 */
export async function getAccessTokenFromStorage() {
  try {
    const accessToken = await StorageService.getData(TOKEN_KEY);
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
 * This function saves the accessToken and it's expire time to AsyncStorage.
 * @param {string} accessToken json web token;
 */
export async function saveAccessTokenToStorage(accessToken) {
  try {
    await StorageService.saveData(TOKEN_KEY, accessToken);
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
 * This function saves the accessToken and it's expire time to AsyncStorage.
 * @param {string} accessToken json web token;
 */
export async function removeAccessTokenFromStorage() {
  await StorageService.removeData(TOKEN_KEY);
}

/**
 * This function tries to grant an accessToken from the AWS authorization endpoint.
 * @param {string} ssn a swedish social security number.
 */
export async function grantAccessToken(ssn) {
  try {
    const response = await post(
      '/auth/token',
      { personalNumber: ssn },
      { 'x-api-key': env.MITTHELSINGBORG_IO_APIKEY }
    );

    if (response.status !== 200) {
      throw new Error(response.data);
    }
    const { token: accessToken } = response.data.data.attributes;
    const decodedAccessToken = await saveAccessTokenToStorage(accessToken);
    return [decodedAccessToken, null];
  } catch (error) {
    console.error(error);
    return [null, error];
  }
}

async function wait(ms = 1000) {
  return new Promise(resolve => {
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
 * Polls multiple times with a timeout inbetween, in order to wait for the backend to create a new user.
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
        function() {
          timesRun += 1;
          return get(`/users/${decodedToken.personalNumber}`, {
            Authorization: accessToken,
          });
        },
        response => timesRun < 5 && response.status !== 200,
        1000
      );
      if (response.status === 200) {
        return [response.data.data.attributes.item, null];
      }
      if (response.status === 404) {
        throw new Error('404, no such user found');
      }
      throw new Error(response);
    }
  } catch (error) {
    console.log(error);
    return [null, error];
  }
}
