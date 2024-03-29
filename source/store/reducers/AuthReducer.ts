import type {
  DispatchError,
  CheckOrderStatusFailureDispatch,
  AddProfileDispatch,
  StartAuthSuccessDispatch,
  StartSignSuccessDispatch,
  SetStatusDispatch,
  SetErrorDispatch,
  SetAuthenticateOnExternalDeviceDispatch,
  SetApiStatusMessagesDispatch,
  SetMaintenanceDispatch,
} from "../actions/AuthActions.types";
import { ActionTypes } from "../actions/AuthActions.types";

import USER_AUTH_STATE from "../../types/UserAuthTypes";
import type { User } from "../../types/UserTypes";
import type { Messages } from "../../types/StatusMessages";

export interface AuthReducerState {
  isActive: boolean;
  isMaintenance: boolean;
  userAuthState: USER_AUTH_STATE;
  user: User | null;
  error: DispatchError;
  status: string;
  orderRef: string | undefined;
  autoStartToken: string | undefined;
  authenticateOnExternalDevice: boolean;
  apiStatusMessages: Messages[];
}

export const initialAuthReducerState: AuthReducerState = {
  isActive: true,
  isMaintenance: false,
  userAuthState: USER_AUTH_STATE.PENDING,
  user: null,
  error: null,
  status: "idle",
  orderRef: undefined,
  autoStartToken: undefined,
  authenticateOnExternalDevice: false,
  apiStatusMessages: [],
};

export default function AuthReducer(
  state: AuthReducerState,
  action: { type: ActionTypes; payload?: unknown }
): AuthReducerState {
  const { type } = action;

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

    case ActionTypes.loginUserFailure: {
      const { payload } = action as CheckOrderStatusFailureDispatch;
      return {
        ...state,
        error: payload,
        isActive: false,
        userAuthState: USER_AUTH_STATE.SIGNED_OUT,
        status: "rejected",
        orderRef: undefined,
        autoStartToken: undefined,
      };
    }

    case ActionTypes.refreshUserSession:
      return {
        ...state,
        userAuthState: USER_AUTH_STATE.SIGNED_IN,
      };

    case ActionTypes.addUserProfile: {
      const { payload } = action as AddProfileDispatch;
      return {
        ...state,
        user: payload,
      };
    }

    case ActionTypes.removeUserProfile:
      return {
        ...state,
        user: null,
      };

    case ActionTypes.authStarted: {
      const { payload } = action as StartAuthSuccessDispatch;
      return {
        ...state,
        orderRef: payload.orderRef,
        autoStartToken: payload.autoStartToken,
        userAuthState: USER_AUTH_STATE.SIGNED_OUT,
      };
    }

    case ActionTypes.authError: {
      const { payload } = action as { payload: DispatchError };
      return {
        ...state,
        error: payload,
        userAuthState: USER_AUTH_STATE.SIGNED_OUT,
        user: null,
        status: "rejected",
        orderRef: undefined,
        autoStartToken: undefined,
      };
    }

    case ActionTypes.cancelAuthOrder:
      return {
        ...state,
        status: "rejected",
        orderRef: undefined,
        autoStartToken: undefined,
      };

    case ActionTypes.signStarted: {
      const { payload } = action as StartSignSuccessDispatch;
      return {
        ...state,
        orderRef: payload.orderRef,
        autoStartToken: payload.autoStartToken,
      };
    }

    case ActionTypes.signSuccess:
      return {
        ...state,
        status: "signResolved",
        orderRef: undefined,
        autoStartToken: undefined,
      };

    case ActionTypes.signFailure: {
      const { payload } = action as { payload: DispatchError };
      return {
        ...state,
        error: payload,
        status: "rejected",
        orderRef: undefined,
        autoStartToken: undefined,
      };
    }

    case ActionTypes.setAuthStatus: {
      const { payload } = action as SetStatusDispatch;
      return {
        ...state,
        status: payload,
      };
    }

    case ActionTypes.setAuthError: {
      const { payload } = action as SetErrorDispatch;
      return {
        ...state,
        error: payload,
      };
    }

    case ActionTypes.setAuthOnExternalDevice: {
      const { payload } = action as SetAuthenticateOnExternalDeviceDispatch;
      return {
        ...state,
        authenticateOnExternalDevice: payload,
      };
    }

    case ActionTypes.apiStatusMessages: {
      const { payload } = action as SetApiStatusMessagesDispatch;
      return {
        ...state,
        apiStatusMessages: payload,
      };
    }

    case ActionTypes.setMaintenance: {
      const { payload } = action as SetMaintenanceDispatch;
      return {
        ...state,
        isMaintenance: payload,
      };
    }

    default:
      return state;
  }
}
