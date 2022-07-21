import type { AuthReducerState } from "../AuthReducer";
import AuthReducer, { initialAuthReducerState } from "../AuthReducer";

import type {
  BankIdAuthOrder,
  DispatchError,
} from "../../actions/AuthActions.types";
import { ActionTypes } from "../../actions/AuthActions.types";

import USER_AUTH_STATE from "../../../types/UserAuthTypes";
import type { User } from "../../../types/UserTypes";

interface TestCase {
  type: ActionTypes;
  newState: AuthReducerState;
  payload?: DispatchError | User | BankIdAuthOrder | boolean;
}

const testError = new Error();

const testUser: User = {
  address: { city: "Ronneby", postalCode: "123", street: "StreetStreet" },
  civilStatus: "status",
  email: "email@test.com",
  firstName: "firstName",
  lastName: "lastName",
  mobilePhone: "123123123213",
};
const testBankIdOrder: BankIdAuthOrder = {
  autoStartToken: "autoStartToken",
  orderRef: "orderRef",
};
const testAuthStatus = "new status";

const testStatusMessage = "new status message";

test.each([
  {
    type: ActionTypes.loginUserSuccess,
    newState: {
      ...initialAuthReducerState,
      userAuthState: USER_AUTH_STATE.SIGNED_IN,
      status: "authResolved",
    },
  },
  {
    type: ActionTypes.loginUserFailure,
    payload: testError,
    newState: {
      ...initialAuthReducerState,
      error: testError,
      isActive: false,
      userAuthState: USER_AUTH_STATE.SIGNED_OUT,
      status: "rejected",
    },
  },
  {
    type: ActionTypes.refreshUserSession,
    newState: {
      ...initialAuthReducerState,
      userAuthState: USER_AUTH_STATE.SIGNED_IN,
    },
  },
  {
    type: ActionTypes.addUserProfile,
    payload: testUser,
    newState: {
      ...initialAuthReducerState,
      user: testUser,
    },
  },
  {
    type: ActionTypes.removeUserProfile,
    payload: null,
    newState: {
      ...initialAuthReducerState,
      user: null,
    },
  },
  {
    type: ActionTypes.authStarted,
    payload: testBankIdOrder,
    newState: {
      ...initialAuthReducerState,
      orderRef: testBankIdOrder.orderRef,
      autoStartToken: testBankIdOrder.autoStartToken,
      userAuthState: USER_AUTH_STATE.SIGNED_OUT,
    },
  },
  {
    type: ActionTypes.authError,
    payload: testError,
    newState: {
      ...initialAuthReducerState,
      error: testError,
      userAuthState: USER_AUTH_STATE.SIGNED_OUT,
      status: "rejected",
    },
  },
  {
    type: ActionTypes.cancelAuthOrder,
    newState: {
      ...initialAuthReducerState,
      status: "rejected",
    },
  },
  {
    type: ActionTypes.signStarted,
    payload: testBankIdOrder,
    newState: {
      ...initialAuthReducerState,
      orderRef: testBankIdOrder.orderRef,
      autoStartToken: testBankIdOrder.autoStartToken,
    },
  },
  {
    type: ActionTypes.signSuccess,
    newState: {
      ...initialAuthReducerState,
      status: "signResolved",
    },
  },
  {
    type: ActionTypes.signFailure,
    payload: testError,
    newState: {
      ...initialAuthReducerState,
      error: testError,
      status: "rejected",
    },
  },
  {
    type: ActionTypes.setAuthStatus,
    payload: testAuthStatus,
    newState: {
      ...initialAuthReducerState,
      status: testAuthStatus,
    },
  },
  {
    type: ActionTypes.setAuthError,
    payload: testError,
    newState: {
      ...initialAuthReducerState,
      error: testError,
    },
  },
  {
    type: ActionTypes.setAuthOnExternalDevice,
    payload: true,
    newState: {
      ...initialAuthReducerState,
      authenticateOnExternalDevice: true,
    },
  },
  {
    type: ActionTypes.apiStatusMessage,
    payload: testStatusMessage,
    newState: {
      ...initialAuthReducerState,
      apiStatusMessage: testStatusMessage,
    },
  },
  {
    type: "UNKNOWN ACTION TYPE" as ActionTypes,
    newState: {
      ...initialAuthReducerState,
    },
  },
] as TestCase[])(
  "sets new state for action type: $type",
  ({ type, newState, payload }) => {
    const state = AuthReducer(initialAuthReducerState, { type, payload });

    expect(state).toEqual(newState);
  }
);
