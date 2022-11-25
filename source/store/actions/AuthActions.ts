import env from "react-native-config";
import bankid from "../../services/BankidService";
import * as authService from "../../services/AuthService";

import type { User } from "../../types/UserTypes";
import type { Messages } from "../../types/StatusMessages";

import type {
  DispatchError,
  MockAuthSucessDispatch,
  MockAuthFailureDispatch,
  LoginSuccessDispatch,
  SetStatusDispatch,
  RemoveProfileDispatch,
  SetErrorDispatch,
  LoginFailureDispatch,
  AddProfileDispatch,
  RefreshSessionSuccessDispatch,
  RefreshSessionFailureDispatch,
  StartAuthSuccessDispatch,
  StartAuthFailureDispatch,
  StartSignSuccessDispatch,
  StartSignFailureDispatch,
  CheckOrderStatusSuccessDispatch,
  CheckOrderStatusFailureDispatch,
  CancelOrderDispatch,
  SetAuthenticateOnExternalDeviceDispatch,
  SetApiStatusMessagesDispatch,
} from "./AuthActions.types";
import { ActionTypes } from "./AuthActions.types";

export async function mockedAuth(): Promise<
  MockAuthSucessDispatch | MockAuthFailureDispatch
> {
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

export function loginSuccess(): LoginSuccessDispatch {
  return {
    type: ActionTypes.loginUserSuccess,
  };
}

export function setStatus(status: string): SetStatusDispatch {
  return {
    type: ActionTypes.setAuthStatus,
    payload: status,
  };
}

export function removeProfile(): RemoveProfileDispatch {
  return {
    type: ActionTypes.removeUserProfile,
  };
}

export function setError(error: DispatchError): SetErrorDispatch {
  return {
    type: ActionTypes.setAuthError,
    payload: error,
  };
}

export async function loginFailure(): Promise<LoginFailureDispatch> {
  await authService.removeAccessTokenFromStorage();
  return {
    type: ActionTypes.loginUserFailure,
  };
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

export async function refreshSession(): Promise<
  RefreshSessionSuccessDispatch | RefreshSessionFailureDispatch
> {
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

export async function startAuth(
  personalNumber: string,
  authenticateOnExternalDevice: boolean
): Promise<StartAuthSuccessDispatch | StartAuthFailureDispatch> {
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

export async function startSign(
  personalNumber: string,
  userVisibleData: string,
  authenticateOnExternalDevice: boolean
): Promise<StartSignSuccessDispatch | StartSignFailureDispatch> {
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

export async function checkOrderStatus(
  autoStartToken: string,
  orderRef: string,
  isUserAuthenticated: boolean
): Promise<CheckOrderStatusSuccessDispatch | CheckOrderStatusFailureDispatch> {
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

export function setAuthenticateOnExternalDevice(
  authOnExternalDeviceFlag: boolean
): SetAuthenticateOnExternalDeviceDispatch {
  return {
    type: ActionTypes.setAuthOnExternalDevice,
    payload: authOnExternalDeviceFlag,
  };
}

export function setApiStatusMessages(
  apiStatusMessages: Messages[]
): SetApiStatusMessagesDispatch {
  return {
    type: ActionTypes.apiStatusMessages,
    payload: apiStatusMessages,
  };
}
