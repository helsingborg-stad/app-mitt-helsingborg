import { actionTypes } from '../actions/AuthActions';

export const initialState = {
  isAuthenticated: false,
  user: {},
  error: null,
  status: 'idle',
};

export default function AuthReducer(state, action) {
  const { type, payload } = action;

  switch (type) {
    case actionTypes.loginSuccess:
      return {
        ...state,
        ...payload,
        isAuthenticated: true,
        status: 'authResolved',
        orderRef: undefined,
        autoStartToken: undefined,
      };

    case actionTypes.loginFailure:
      return {
        ...state,
        isAuthenticated: false,
        status: 'rejected',
        orderRef: undefined,
        autoStartToken: undefined,
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
        isAuthenticated: false,
      };

    case actionTypes.authError:
      return {
        ...state,
        ...payload,
        isAuthenticated: false,
        user: null,
        status: 'rejected',
        orderRef: undefined,
        autoStartToken: undefined,
      };

    case actionTypes.authCanceled:
      return {
        ...state,
        ...payload,
        isAuthenticated: false,
        user: null,
        status: 'rejected',
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
        status: 'signResolved',
        orderRef: undefined,
        autoStartToken: undefined,
      };

    case actionTypes.signError:
      return {
        ...state,
        ...payload,
        status: 'rejected',
        orderRef: undefined,
        autoStartToken: undefined,
      };

    case actionTypes.setPending:
      return {
        ...state,
        status: 'pending',
      };

    default:
      return state;
  }
}
