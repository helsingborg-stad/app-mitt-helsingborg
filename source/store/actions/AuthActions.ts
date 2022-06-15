import env from "react-native-config";
import bankid from "../../services/BankidService";
import * as authService from "../../services/AuthService";

import { User } from "../../types/UserTypes";

export enum ActionTypes {
  loginUserSuccess = "LOGIN_SUCCESS",
  loginUserFailure = "LOGIN_FAILURE",
  refreshUserSession = "REFRESH_CREDENTIALS",
  addUserProfile = "ADD_PROFILE",
  removeUserProfile = "REMOVE_PROFILE",
  authStarted = "AUTH_STARTED",
  authError = "AUTH_ERROR",
  signFailure = "SIGN_FAILURE",
  cancelAuthOrder = "CANCEL_ORDER",
  signStarted = "SIGN_STARTED",
  setAuthStatus = "SET_STATUS",
  setAuthError = "SET_ERROR",
  signSuccess = "SIGN_SUCCESS",
  setAuthOnExternalDevice = "SET_AUTH_ON_EXTERNAL_DEVICE",
  apiStatusMessage = "API_STATUS_MESSAGE",
}

export interface DispatchDefault {
  type: ActionTypes;
  payload?: Record<string, string> | Error | string | boolean | null;
}

export type DispatchError = Error | null;

export interface BankIdAuthOrder {
  orderRef: string;
  autoStartToken: string;
}

export interface MockAuthDispatch {
  type: ActionTypes.loginUserSuccess | ActionTypes.authError;
  payload?: DispatchError;
}
export async function mockedAuth(): Promise<{
  type: ActionTypes.loginUserSuccess | ActionTypes.authError;
  payload?: DispatchError;
}> {
  try {
    const [, grantTokenError] = await authService.grantAccessToken(
      env.FAKE_TOKEN
    );
    if (grantTokenError) {
      throw new Error(grantTokenError);
    }

    return {
      type: ActionTypes.loginUserSuccess,
    };
  } catch (error) {
    return {
      type: ActionTypes.authError,
      payload: error as DispatchError,
    };
  }
}

export interface LoginSuccessDispatch {
  type: ActionTypes.loginUserSuccess;
}
export function loginSuccess(): LoginSuccessDispatch {
  return {
    type: ActionTypes.loginUserSuccess,
  };
}

export interface SetStatusDispatch {
  type: ActionTypes.setAuthStatus;
  payload: string;
}
export function setStatus(status: string): SetStatusDispatch {
  return {
    type: ActionTypes.setAuthStatus,
    payload: status,
  };
}

export interface RemoveProfileDispatch {
  type: ActionTypes.removeUserProfile;
}
export function removeProfile(): RemoveProfileDispatch {
  return {
    type: ActionTypes.removeUserProfile,
  };
}

export interface SetErrorDispatch {
  type: ActionTypes.setAuthError;
  payload: DispatchError;
}
export function setError(error: DispatchError): SetErrorDispatch {
  return {
    type: ActionTypes.setAuthError,
    payload: error,
  };
}

export interface LoginFailureDispatch {
  type: ActionTypes.loginUserFailure;
}
export async function loginFailure(): Promise<LoginFailureDispatch> {
  await authService.removeAccessTokenFromStorage();
  return {
    type: ActionTypes.loginUserFailure,
  };
}

export interface AddProfileDispatch {
  type: ActionTypes.addUserProfile;
  payload: User | null;
}
export async function addProfile(): Promise<AddProfileDispatch> {
  const decodedToken = await authService.getAccessTokenFromStorage();
  const [userProfile, userError] = (await authService.getUserProfile(
    decodedToken.accessToken
  )) as [User | null, Error | null];

  if (userError) {
    throw userError;
  }

  return {
    type: ActionTypes.addUserProfile,
    payload: userProfile,
  };
}

export interface RefreshSessionDispatch {
  type: ActionTypes.authError | ActionTypes.refreshUserSession;
  payload?: DispatchError;
}
export async function refreshSession(): Promise<RefreshSessionDispatch> {
  const [, refreshError] = await authService.refreshTokens();
  if (refreshError) {
    return {
      type: ActionTypes.authError,
      payload: refreshError,
    };
  }
  return {
    type: ActionTypes.refreshUserSession,
  };
}

export interface StartAuthDispatch {
  type: ActionTypes.authStarted | ActionTypes.authError;
  payload?: BankIdAuthOrder | DispatchError;
}
export async function startAuth(
  personalNumber: string,
  authenticateOnExternalDevice: boolean
): Promise<StartAuthDispatch> {
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
      type: ActionTypes.authStarted,
      payload: {
        orderRef,
        autoStartToken,
      },
    };
  } catch (error) {
    return {
      type: ActionTypes.authError,
      payload: error as DispatchError,
    };
  }
}

export interface StartSignDispatch {
  type: ActionTypes.signStarted | ActionTypes.signFailure;
  payload: BankIdAuthOrder | Error;
}
export async function startSign(
  personalNumber: string,
  userVisibleData: string,
  authenticateOnExternalDevice: boolean
): Promise<StartSignDispatch> {
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
      type: ActionTypes.signStarted,
      payload: {
        orderRef,
        autoStartToken,
      },
    };
  } catch (error) {
    return {
      type: ActionTypes.signFailure,
      payload: error?.data ?? null,
    };
  }
}

export interface CheckOrderStatusDispatch {
  type:
    | ActionTypes.loginUserSuccess
    | ActionTypes.signSuccess
    | ActionTypes.loginUserFailure
    | ActionTypes.signFailure;
  payload?: DispatchError;
}
export async function checkOrderStatus(
  autoStartToken: string,
  orderRef: string,
  isUserAuthenticated: boolean
): Promise<CheckOrderStatusDispatch> {
  try {
    // Try to collect a successfull collect response from bankid.
    const response = await bankid.collect(orderRef);

    if (response.success === false) {
      throw new Error(response.data);
    }

    // Tries to grant a token from the authorization endpoint in the api.
    const { authorizationCode } = response.data.attributes;
    const [, grantTokenError] = await authService.grantAccessToken(
      authorizationCode
    );
    if (grantTokenError) {
      throw new Error(grantTokenError);
    }

    return {
      type: !isUserAuthenticated
        ? ActionTypes.loginUserSuccess
        : ActionTypes.signSuccess,
    };
  } catch (error) {
    return {
      type: !isUserAuthenticated
        ? ActionTypes.loginUserFailure
        : ActionTypes.signFailure,
      payload: error as DispatchError,
    };
  }
}

export interface CancelOrderDispatch {
  type: ActionTypes.cancelAuthOrder;
}
export async function cancelOrder(
  orderRef: string | undefined
): Promise<CancelOrderDispatch> {
  try {
    const response = await bankid.cancel(orderRef);

    if (response.success === false) {
      throw new Error(response.data);
    }
  } catch (error) {
    console.error("Could not cancel bankid order with ref: ", orderRef);
  }

  return {
    type: ActionTypes.cancelAuthOrder,
  };
}

export interface SetAuthenticateOnExternalDeviceDispatch {
  type: ActionTypes.setAuthOnExternalDevice;
  payload: boolean;
}
export function setAuthenticateOnExternalDevice(
  authOnExternalDeviceFlag: boolean
): SetAuthenticateOnExternalDeviceDispatch {
  return {
    type: ActionTypes.setAuthOnExternalDevice,
    payload: authOnExternalDeviceFlag,
  };
}

export interface SetApiStatusMessageDispatch {
  type: ActionTypes.apiStatusMessage;
  payload: string;
}
export function setApiStatusMessage(
  apiStatusMessage: string
): SetApiStatusMessageDispatch {
  return {
    type: ActionTypes.apiStatusMessage,
    payload: apiStatusMessage,
  };
}
