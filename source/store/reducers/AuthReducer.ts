import { ActionTypes, DispatchError } from "../actions/AuthActions";

import USER_AUTH_STATE from "../../types/UserAuthTypes";
import { User } from "../../types/UserTypes";

export interface AuthReducerState {
  isActive: boolean;
  userAuthState: USER_AUTH_STATE;
  user: User | null;
  error: Error | null;
  status: string;
  authenticateOnExternalDevice: boolean;
  apiStatusMessage: string;
  orderRef: string | undefined;
  autoStartToken: string | undefined;
}

export const initialAuthReducerState: AuthReducerState = {
  isActive: true,
  userAuthState: USER_AUTH_STATE.PENDING,
  user: null,
  error: null,
  status: "idle",
  orderRef: undefined,
  autoStartToken: undefined,
  authenticateOnExternalDevice: false,
  apiStatusMessage: "",
};

export default function AuthReducer(
  state: AuthReducerState,
  action: { type: ActionTypes; payload?: unknown }
): AuthReducerState {
  const { type, payload } = action;

  switch (type) {
    case ActionTypes.loginUserSuccess:
      return {
        ...state,
        isActive: true,
        userAuthState: USER_AUTH_STATE.SIGNED_IN,
        status: "authResolved",
        orderRef: undefined,
        autoStartToken: undefined,
      };

    case ActionTypes.loginUserFailure:
      return {
        ...state,
        error: payload as DispatchError,
        isActive: false,
        userAuthState: USER_AUTH_STATE.SIGNED_OUT,
        status: "rejected",
        orderRef: undefined,
        autoStartToken: undefined,
      };

    case ActionTypes.refreshUserSession:
      return {
        ...state,
        userAuthState: USER_AUTH_STATE.SIGNED_IN,
      };

    case ActionTypes.addUserProfile:
      return {
        ...state,
        user: payload as User,
      };

    case ActionTypes.removeUserProfile:
      return {
        ...state,
        user: null,
      };

    case ActionTypes.authStarted:
      return {
        ...state,
        orderRef: payload?.orderRef ?? "",
        autoStartToken: payload.autoStartToken ?? "",
        userAuthState: USER_AUTH_STATE.SIGNED_OUT,
      };

    case ActionTypes.authError:
      return {
        ...state,
        error: payload as DispatchError,
        userAuthState: USER_AUTH_STATE.SIGNED_OUT,
        user: null,
        status: "rejected",
        orderRef: undefined,
        autoStartToken: undefined,
      };

    case ActionTypes.cancelAuthOrder:
      return {
        ...state,
        status: "rejected",
        orderRef: undefined,
        autoStartToken: undefined,
      };

    case ActionTypes.signStarted:
      return {
        ...state,
        orderRef: payload?.orderRef ?? "",
        autoStartToken: payload.autoStartToken ?? "",
      };

    case ActionTypes.signSuccess:
      return {
        ...state,
        status: "signResolved",
        orderRef: undefined,
        autoStartToken: undefined,
      };

    case ActionTypes.signFailure:
      return {
        ...state,
        error: payload as DispatchError,
        status: "rejected",
        orderRef: undefined,
        autoStartToken: undefined,
      };

    case ActionTypes.setAuthStatus:
      return {
        ...state,
        status: payload as string,
      };

    case ActionTypes.setAuthError:
      return {
        ...state,
        error: payload as DispatchError,
      };

    case ActionTypes.setAuthOnExternalDevice:
      return {
        ...state,
        authenticateOnExternalDevice: payload as boolean,
      };

    case ActionTypes.apiStatusMessage:
      return {
        ...state,
        apiStatusMessage: payload as string,
      };

    default:
      return state;
  }
}
