import env from 'react-native-config';
import { get, post } from 'app/helpers/ApiRequest';
import bankid from 'app/services/BankidService';
import JwtDecode from 'jwt-decode';
import StorageService, { TOKEN_KEY, USER_KEY } from 'app/services/StorageService';
import { getMockUser } from 'app/services/UserService';

export const actionTypes = {
  loginSuccess: 'LOGIN_SUCCESS',
  loginFailure: 'LOGIN_FAILURE',
  addProfile: 'ADD_PROFILE',
  removeProfile: 'REMOVE_PROFILE',
  authStarted: 'AUTH_STARTED',
  authCompleted: 'AUTH_COMPLETED',
  authError: 'AUTH_ERROR',
  authCanceled: 'AUTH_CANCELED',
};

export async function mockedAuth() {
  try {
    const user = getMockUser();
    await StorageService.saveData(USER_KEY, user);
    await StorageService.saveData(TOKEN_KEY, env.FAKE_TOKEN);
    return {
      type: actionTypes.loginSuccess,
      payload: { user },
    };
  } catch (error) {
    return {
      type: actionTypes.authError,
      paylaod: {
        error,
      },
    };
  }
}

export function loginSuccess() {
  return {
    type: actionTypes.loginSuccess,
  };
}
export function loginFailure() {
  return {
    type: actionTypes.loginFailure,
  };
}

export function addProfile(obj) {
  return {
    type: actionTypes.addProfile,
    payload: obj,
  };
}

export function removeProfile() {
  return {
    type: actionTypes.removeProfile,
  };
}

export async function startAuth(ssn) {
  try {
    const response = await bankid.auth(ssn);
    if (response.success === false) {
      throw new Error(response.data);
    }

    const { order_ref: orderRef, auto_start_token: autoStartToken } = response.data;

    return {
      type: actionTypes.authStarted,
      payload: {
        orderRef,
        autoStartToken,
      },
    };
  } catch (error) {
    return {
      type: actionTypes.authError,
      payload: {
        error: error.data,
      },
    };
  }
}

export async function cancelAuth(orderRef) {
  await bankid.cancel(orderRef);
  return {
    type: actionTypes.authError,
    payload: {
      error: 'Åtgärden blev avbruten',
    },
  };
}

async function getUserProfile(accessToken) {
  const decodedToken = JwtDecode(accessToken);
  if (decodedToken) {
    const response = await get(`/users/${decodedToken.personalNumber}`, {
      Authorization: accessToken,
    });
    return response.data.data.attributes.item;
  }
  return null;
}

// TODO: Seperate getUserProfile from this function.
async function grantAccessToken(ssn) {
  try {
    const response = await post(
      '/auth/token',
      { personalNumber: ssn },
      { 'x-api-key': env.MITTHELSINGBORG_IO_APIKEY }
    );

    if (response.status !== 200) {
      return {
        type: actionTypes.authError,
        payload: {
          error: response.data,
        },
      };
    }
    console.log(response);
    const { token: accessToken } = response.data.data.attributes;
    // Save accessToken to storage.
    await StorageService.saveData(TOKEN_KEY, accessToken);
    // TODO: Add real expired at time from token.
    const expiresAt = JSON.stringify(900000 + new Date().getTime());
    await StorageService.saveData('expiresAt', expiresAt);

    return accessToken;
  } catch (error) {
    console.error('Token Auth Error:', error);
    return {
      type: actionTypes.loginFailure,
      payload: {
        error,
      },
    };
  }
}

export async function checkAuthStatus(autoStartToken, orderRef) {
  try {
    bankid.launchApp(autoStartToken);
    const response = await bankid.collect(orderRef);
    if (response.success === false) {
      throw new Error(response.data);
    }

    const { personal_number: ssn } = response.data.attributes.completion_data.user;
    const accessToken = await grantAccessToken(ssn);

    const userProfile = await getUserProfile(accessToken);

    return {
      type: actionTypes.loginSuccess,
      payload: {
        user: userProfile,
      },
    };
  } catch (error) {
    return {
      type: actionTypes.loginFailure,
      payload: {
        error: error.data,
      },
    };
  }
}
