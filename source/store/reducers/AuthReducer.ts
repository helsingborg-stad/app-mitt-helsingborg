import { actionTypes } from "../actions/AuthActions";

import USER_AUTH_STATE from "../../types/UserAuthTypes";

export const initialState = {
  isActive: true,
  userAuthState: USER_AUTH_STATE.PENDING,
  user: null,
  error: null,
  status: "idle",
  authenticateOnExternalDevice: false,
};

export default function AuthReducer(state, action) {
  const { type, payload } = action;

  switch (type) {
    case actionTypes.loginSuccess:
      return {
        ...state,
        ...payload,
        isActive: true,
        userAuthState: USER_AUTH_STATE.SIGNED_IN,
        status: "authResolved",
        orderRef: undefined,
        autoStartToken: undefined,
      };

    case actionTypes.loginFailure:
      return {
        ...state,
        ...payload,
        isActive: false,
        userAuthState: USER_AUTH_STATE.SIGNED_OUT,
        status: "rejected",
        orderRef: undefined,
        autoStartToken: undefined,
      };

    case actionTypes.refreshSession:
      return {
        ...state,
        userAuthState: USER_AUTH_STATE.SIGNED_IN,
      };

    case actionTypes.addProfile:
      return {
        ...state,
        user: payload,
      };

    case actionTypes.removeProfile:
      return {
        ...state,
        user: null,
      };

    case actionTypes.authStarted:
      return {
        ...state,
        ...payload,
        userAuthState: USER_AUTH_STATE.SIGNED_OUT,
      };

    case actionTypes.authError:
      return {
        ...state,
        ...payload,
        userAuthState: USER_AUTH_STATE.SIGNED_OUT,
        user: null,
        status: "rejected",
        orderRef: undefined,
        autoStartToken: undefined,
      };

    case actionTypes.cancelOrder:
      return {
        ...state,
        ...payload,
        status: "rejected",
        orderRef: undefined,
        autoStartToken: undefined,
      };

    case actionTypes.signStarted:
      return {
        ...state,
        ...payload,
      };

    case actionTypes.signSuccess:
      return {
        ...state,
        status: "signResolved",
        orderRef: undefined,
        autoStartToken: undefined,
      };

    case actionTypes.signFailure:
      return {
        ...state,
        ...payload,
        status: "rejected",
        orderRef: undefined,
        autoStartToken: undefined,
      };

    case actionTypes.setStatus:
      return {
        ...state,
        status: action.status,
      };

    case actionTypes.setError:
      return {
        ...state,
        ...payload,
      };

    case actionTypes.setAuthenticateOnExternalDevice:
      return {
        ...state,
        authenticateOnExternalDevice: action.authenticateOnExternalDevice,
      };

    default:
      return state;
  }
}
