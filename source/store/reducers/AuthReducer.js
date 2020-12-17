import { actionTypes } from '../actions/AuthActions';

export const initialState = {
  isActive: true,
  isAuthenticated: false,
  user: {},
  error: null,
  status: 'idle',
  isBankidInstalled: false,
  // testing...
  showInactivityDialog: false,
  latestActivityTime: Date.now(),
};

export default function AuthReducer(state, action) {
  const { type, payload } = action;

  switch (type) {
    case actionTypes.updateActivityTime: {
      return {
        ...state,
        latestActivityTime: payload.activityTime,
      };
    }

    case actionTypes.toggleInactivityDialog: {
      return {
        ...state,
        showInactivityDialog: payload.showInactivityDialog,
      };
    }

    case actionTypes.loginSuccess:
      return {
        ...state,
        ...payload,
        isActive: true,
        isAuthenticated: true,
        status: 'authResolved',
        orderRef: undefined,
        autoStartToken: undefined,
      };

    case actionTypes.loginFailure:
      return {
        ...state,
        ...payload,
        isActive: false,
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

    case actionTypes.cancelOrder:
      return {
        ...state,
        ...payload,
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

    case actionTypes.signFailure:
      return {
        ...state,
        ...payload,
        status: 'rejected',
        orderRef: undefined,
        autoStartToken: undefined,
      };

    case actionTypes.setStatus:
      return {
        ...state,
        status: action.status,
      };

    case actionTypes.setIsBankidInstalled:
      return {
        ...state,
        isBankidInstalled: action.isBankidInstalled,
      };

    default:
      return state;
  }
}
