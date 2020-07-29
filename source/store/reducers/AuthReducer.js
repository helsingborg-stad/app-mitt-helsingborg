import { actionTypes } from '../actions/AuthActions';

export const initialState = {
  isAuthenticated: false,
  isAuthorizing: false,
  user: null,
  error: null,
};

export default function AuthReducer(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case actionTypes.loginSuccess:
      return {
        ...state,
        ...payload,
        isAuthenticated: true,
        isAuthorizing: false,
      };

    case actionTypes.loginFailure:
      return {
        ...state,
        isAuthenticated: false,
        isAuthorizing: false,
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
        isAuthorizing: true,
        isAuthenticated: false,
      };

    case actionTypes.authError:
      return {
        ...state,
        ...payload,
        isAuthorizing: false,
        isAuthenticated: false,
        user: null,
      };
    case actionTypes.authCanceled:
      return {
        ...state,
        ...payload,
        isAuthorizing: false,
        isAuthenticated: false,
        user: null,
      };

    case actionTypes.authCompleted:
      return {
        ...state,
        ...payload,
        isAuthorizing: false,
        isAuthenticated: true,
      };

    default:
      return state;
  }
}
