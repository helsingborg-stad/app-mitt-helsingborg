import env from 'react-native-config';
import bankid from 'app/services/BankidService';
import * as authService from 'app/services/AuthService';
import StorageService, { TOKEN_KEY, USER_KEY } from 'app/services/StorageService';
import { getMockUser } from 'app/services/UserService';

export const actionTypes = {
  loginSuccess: 'LOGIN_SUCCESS',
  loginFailure: 'LOGIN_FAILURE',
  addProfile: 'ADD_PROFILE',
  removeProfile: 'REMOVE_PROFILE',
  authStarted: 'AUTH_STARTED',
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
      payload: {
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
    console.log('Start Auth');
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

export async function checkAuthStatus(autoStartToken, orderRef) {
  try {
    console.log('Check Auth Status');
    // Tries to start the bankId app on the device for user authorization.
    await bankid.launchApp(autoStartToken);

    // Try to collect a successfull collect response from bankid.
    const response = await bankid.collect(orderRef);
    if (response.success === false) {
      throw new Error(response.data);
    }

    // Tries to grant a token from the authorization endpoint in the api.
    const { personal_number: ssn } = response.data.attributes.completion_data.user;
    const [decodedAccessToken, grantTokenError] = await authService.grantAccessToken(ssn);
    if (grantTokenError) {
      throw new Error(grantTokenError);
    }

    console.log('token retrived', decodedAccessToken);

    // Tries to retrive an user from the api with accessToken.
    const [userProfile, userError] = await authService.getUserProfile(
      decodedAccessToken.accessToken
    );

    if (userError) {
      throw new Error(userError);
    }

    return {
      type: actionTypes.loginSuccess,
      payload: {
        user: userProfile,
      },
    };
  } catch (error) {
    console.log(error);
    return {
      type: actionTypes.loginFailure,
      payload: {
        error: error.data,
      },
    };
  }
}
