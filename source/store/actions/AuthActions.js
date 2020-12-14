import env from 'react-native-config';
import bankid from '../../services/BankidService';
import * as authService from '../../services/AuthService';
import StorageService, {TOKEN_KEY} from '../../services/StorageService';
import {UrlHelper} from '../../helpers';

const {canOpenUrl} = UrlHelper;

export const actionTypes = {
  loginSuccess: 'LOGIN_SUCCESS',
  loginFailure: 'LOGIN_FAILURE',
  addProfile: 'ADD_PROFILE',
  removeProfile: 'REMOVE_PROFILE',
  authStarted: 'AUTH_STARTED',
  authError: 'AUTH_ERROR',
  signFailure: 'SIGN_FAILURE',
  cancelOrder: 'CANCEL_ORDER',
  signStarted: 'SIGN_STARTED',
  setStatus: 'SET_STATUS',
  signSuccess: 'SIGN_SUCCESS',
  setIsBankidInstalled: 'SET_INSTALLED',
};

export async function mockedAuth() {
  try {
    await StorageService.saveData(TOKEN_KEY, env.FAKE_TOKEN);
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

export async function loginFailure() {
  await authService.removeAccessTokenFromStorage();
  return {
    type: actionTypes.loginFailure,
  };
}

export async function addProfile() {
  try {
    const decodedToken = await authService.getAccessTokenFromStorage();
    const [userProfile, userError] = await authService.getUserProfile(
      decodedToken.accessToken,
    );

    if (userError) {
      throw new Error(userError);
    }

    return {
      type: actionTypes.addProfile,
      payload: userProfile,
    };
  } catch (error) {
    console.error(error);
    return {
      type: actionTypes.authError,
    };
  }
}

export function removeProfile() {
  return {
    type: actionTypes.removeProfile,
  };
}

export async function startAuth(ssn, launchBankidApp) {
  try {
    const response = await bankid.auth(ssn);
    if (response.success === false) {
      throw new Error(response.data);
    }
    const {orderRef, autoStartToken} = response.data;

    if (launchBankidApp) {
      // Tries to start the bankId app on the device for user authorization.
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
        error: error.data,
      },
    };
  }
}

export async function startSign(
  personalNumber,
  userVisibleData,
  launchBankidApp,
) {
  try {
    const response = await bankid.sign(personalNumber, userVisibleData);

    if (response.success === false) {
      throw new Error(response.data);
    }

    const {orderRef, autoStartToken} = response.data;

    if (launchBankidApp) {
      // Tries to start the bankId app on the device for user authorization.
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

export async function checkOrderStatus(
  autoStartToken,
  orderRef,
  isUserAuthenticated,
) {
  try {
    // Try to collect a successfull collect response from bankid.
    const response = await bankid.collect(orderRef);

    if (response.success === false) {
      throw new Error(response.data);
    }

    // Tries to grant a token from the authorization endpoint in the api.
    const {personalNumber} = response.data.attributes.completionData.user;

    // eslint-disable-next-line no-unused-vars
    const [__, grantTokenError] = await authService.grantAccessToken(
      personalNumber,
    );
    if (grantTokenError) {
      throw new Error(grantTokenError);
    }

    return {
      type: !isUserAuthenticated
        ? actionTypes.loginSuccess
        : actionTypes.signSuccess,
    };
  } catch (error) {
    return {
      type: !isUserAuthenticated
        ? actionTypes.loginFailure
        : actionTypes.signFailure,
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

export async function checkIsBankidInstalled() {
  const isInstalled = await canOpenUrl('bankid:///');
  return {
    type: actionTypes.setIsBankidInstalled,
    isBankidInstalled: isInstalled,
  };
}
