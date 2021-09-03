import env from 'react-native-config';
import bankid from '../../services/BankidService';
import * as authService from '../../services/AuthService';
import { UrlHelper } from '../../helpers';

const { canOpenUrl } = UrlHelper;

export const actionTypes = {
  loginSuccess: 'LOGIN_SUCCESS',
  loginFailure: 'LOGIN_FAILURE',
  refreshSession: 'REFRESH_CREDENTIALS',
  addProfile: 'ADD_PROFILE',
  removeProfile: 'REMOVE_PROFILE',
  authStarted: 'AUTH_STARTED',
  authError: 'AUTH_ERROR',
  signFailure: 'SIGN_FAILURE',
  cancelOrder: 'CANCEL_ORDER',
  signStarted: 'SIGN_STARTED',
  setStatus: 'SET_STATUS',
  setError: 'SET_ERROR',
  signSuccess: 'SIGN_SUCCESS',
  setAuthenticateOnExternalDevice: 'SET_AUTH_ON_EXTERNAL_DEVICE',
};

export async function mockedAuth() {
  try {
    const [, grantTokenError] = await authService.grantAccessToken(env.FAKE_TOKEN);
    if (grantTokenError) {
      throw new Error(grantTokenError);
    }

    return {
      type: actionTypes.loginSuccess,
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

export function setStatus(status) {
  return {
    type: actionTypes.setStatus,
    status,
  };
}

export function setError(error) {
  return {
    type: actionTypes.setError,
    payload: {
      error,
    },
  };
}

export async function loginFailure() {
  await authService.removeAccessTokenFromStorage();
  return {
    type: actionTypes.loginFailure,
  };
}

export async function addProfile() {
  try {
    const decodedToken = await authService.getAccessTokenFromStorage();
    const [userProfile, userError] = await authService.getUserProfile(decodedToken.accessToken);

    if (userError) {
      throw userError;
    }

    return {
      type: actionTypes.addProfile,
      payload: userProfile,
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

export function removeProfile() {
  return {
    type: actionTypes.removeProfile,
  };
}

export async function refreshSession() {
  const [, refreshError] = await authService.refreshTokens();
  if (refreshError) {
    return {
      type: actionTypes.authError,
      payload: {
        error: refreshError,
      },
    };
  }
  return {
    type: actionTypes.refreshSession,
  };
}

export async function startAuth(personalNumber, authenticateOnExternalDevice) {
  try {
    const response = await bankid.auth(personalNumber);
    if (response.success === false) {
      throw new Error(response.data);
    }
    const { orderRef, autoStartToken } = response.data;

    if (!authenticateOnExternalDevice) {
      // Start the bankId app on the device for user authorization.
      await bankid.launchApp(autoStartToken);
    }

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
        error,
      },
    };
  }
}

export async function startSign(personalNumber, userVisibleData, authenticateOnExternalDevice) {
  try {
    const response = await bankid.sign(personalNumber, userVisibleData);

    if (response.success === false) {
      throw new Error(response.data);
    }

    const { orderRef, autoStartToken } = response.data;

    if (!authenticateOnExternalDevice) {
      // Start the bankId app on the device for user authorization.
      await bankid.launchApp(autoStartToken);
    }

    return {
      type: actionTypes.signStarted,
      payload: {
        orderRef,
        autoStartToken,
      },
    };
  } catch (error) {
    return {
      type: actionTypes.signError,
      payload: {
        error: error.data,
      },
    };
  }
}

export async function checkOrderStatus(autoStartToken, orderRef, isUserAuthenticated) {
  try {
    // Try to collect a successfull collect response from bankid.
    const response = await bankid.collect(orderRef);

    if (response.success === false) {
      throw new Error(response.data);
    }

    // Tries to grant a token from the authorization endpoint in the api.
    const { authorizationCode } = response.data.attributes;
    const [, grantTokenError] = await authService.grantAccessToken(authorizationCode);
    if (grantTokenError) {
      throw new Error(grantTokenError);
    }

    return {
      type: !isUserAuthenticated ? actionTypes.loginSuccess : actionTypes.signSuccess,
    };
  } catch (error) {
    return {
      type: !isUserAuthenticated ? actionTypes.loginFailure : actionTypes.signFailure,
      payload: {
        error,
      },
    };
  }
}

export async function cancelOrder(orderRef) {
  try {
    const response = await bankid.cancel(orderRef);

    if (response.success === false) {
      throw new Error(response.data);
    }

    return {
      type: actionTypes.cancelOrder,
    };
  } catch (error) {
    return {
      type: actionTypes.cancelOrder,
    };
  }
}

export function setAuthenticateOnExternalDevice(value) {
  return {
    type: actionTypes.setAuthenticateOnExternalDevice,
    authenticateOnExternalDevice: value,
  };
}
