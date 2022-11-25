import type { User } from "../../types/UserTypes";
import type { Messages } from "../../types/StatusMessages";

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
  apiStatusMessages = "API_STATUS_MESSAGES",
  setMaintenance = "SET_MAINTENANCE",
}

export type DispatchError = Error | null | string;

export interface BankIdAuthOrder {
  orderRef: string;
  autoStartToken: string;
}

export interface MockAuthSucessDispatch {
  type: ActionTypes.loginUserSuccess;
}
export interface MockAuthFailureDispatch {
  type: ActionTypes.authError;
  payload: DispatchError;
}

export interface LoginSuccessDispatch {
  type: ActionTypes.loginUserSuccess;
}

export interface SetStatusDispatch {
  type: ActionTypes.setAuthStatus;
  payload: string;
}

export interface RemoveProfileDispatch {
  type: ActionTypes.removeUserProfile;
}

export interface SetErrorDispatch {
  type: ActionTypes.setAuthError;
  payload: DispatchError;
}

export interface LoginFailureDispatch {
  type: ActionTypes.loginUserFailure;
}

export interface AddProfileDispatch {
  type: ActionTypes.addUserProfile;
  payload: User | null;
}

export interface RefreshSessionSuccessDispatch {
  type: ActionTypes.refreshUserSession;
}
export interface RefreshSessionFailureDispatch {
  type: ActionTypes.authError;
  payload?: DispatchError;
}

export interface StartAuthSuccessDispatch {
  type: ActionTypes.authStarted;
  payload: BankIdAuthOrder;
}
export interface StartAuthFailureDispatch {
  type: ActionTypes.authError;
  payload: DispatchError;
}

export interface StartSignSuccessDispatch {
  type: ActionTypes.signStarted;
  payload: BankIdAuthOrder;
}
export interface StartSignFailureDispatch {
  type: ActionTypes.signFailure;
  payload: Error;
}

export interface CheckOrderStatusSuccessDispatch {
  type: ActionTypes.loginUserSuccess | ActionTypes.signSuccess;
}
export interface CheckOrderStatusFailureDispatch {
  type: ActionTypes.loginUserFailure | ActionTypes.signFailure;
  payload: DispatchError;
}

export interface CancelOrderDispatch {
  type: ActionTypes.cancelAuthOrder;
}

export interface SetAuthenticateOnExternalDeviceDispatch {
  type: ActionTypes.setAuthOnExternalDevice;
  payload: boolean;
}

export interface SetApiStatusMessagesDispatch {
  type: ActionTypes.apiStatusMessages;
  payload: Messages[];
}

export interface SetMaintenanceDispatch {
  type: ActionTypes.setMaintenance;
  payload: boolean;
}
