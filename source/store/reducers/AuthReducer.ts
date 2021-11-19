import { actionTypes } from "../actions/AuthActions";

import AUTH_STATE from "../types";

export const initialState = {
  isActive: true,
  authState: AUTH_STATE.PENDING,
  user: null,
  error: null,
  status: "pending",
  authenticateOnExternalDevice: false,
};

export default function AuthReducer(state: any, action: any): any {
  const { type, payload } = action;
  console.log("AUTH REDUCER: ", type, payload);

  switch (type) {
    case actionTypes.loginSuccess:
      return {
        ...state,
        ...payload,
        isActive: true,
        authState: AUTH_STATE.SIGNED_IN,
        status: "authResolved",
        orderRef: undefined,
        autoStartToken: undefined,
      };

    case actionTypes.loginFailure:
      return {
        ...state,
        ...payload,
        isActive: false,
        authState: AUTH_STATE.SIGNED_OUT,
        status: "rejected",
        orderRef: undefined,
        autoStartToken: undefined,
      };

    case actionTypes.refreshSession:
      return {
        ...state,
        authState: AUTH_STATE.SIGNED_IN,
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
        authState: AUTH_STATE.SIGNED_OUT,
      };

    case actionTypes.authError:
      return {
        ...state,
        ...payload,
        authState: AUTH_STATE.SIGNED_OUT,
        user: null,
        status: "rejected",
        orderRef: undefined,
        autoStartToken: undefined,
      };

    case actionTypes.cancelOrder:
      return {
        ...state,
        payload: undefined,
        status: "rejected",
        orderRef: undefined,
        autoStartToken: undefined,
        authState: AUTH_STATE.SIGNED_OUT,
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
        payload: undefined,
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
