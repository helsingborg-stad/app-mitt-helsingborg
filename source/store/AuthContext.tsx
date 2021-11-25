import React, { useEffect, useReducer, useContext, useCallback } from "react";
import PropTypes from "prop-types";
import env from "react-native-config";
import AppContext from "./AppContext";
import * as authService from "../services/AuthService";

import AuthReducer, {
  initialState as defaultInitialState,
} from "./reducers/AuthReducer";
import {
  startAuth,
  cancelOrder,
  loginFailure,
  loginSuccess,
  refreshSession,
  checkOrderStatus,
  removeProfile,
  addProfile,
  mockedAuth,
  startSign,
  setStatus,
  setError,
  setAuthenticateOnExternalDevice,
} from "./actions/AuthActions";

import AUTH_STATE from "./types";

const AuthContext = React.createContext(undefined);

function AuthProvider({ children, initialState }: any): JSX.Element {
  const [state, dispatch] = useReducer(AuthReducer, initialState);
  const { handleSetMode } = useContext(AppContext);

  /**
   * Starts polling for an order response if status is pending and orderRef is set in state.
   */
  useEffect(() => {
    const handleCheckOrderStatus = async () => {
      if (state.status === "pending" && state.orderRef) {
        dispatch(
          await checkOrderStatus(
            state.orderRef,
            state.authState === AUTH_STATE.SIGNED_IN
          )
        );
      }
    };
    void handleCheckOrderStatus();
  }, [state.status, state.orderRef, state.authState]);

  /**
   * Used to save user profile data to the state.
   */
  async function handleAddProfile() {
    dispatch(await addProfile());
  }

  /**
   * Dispatch action to set authentication state of the user true
   */
  function handleLogin() {
    dispatch(loginSuccess());
  }

  /**
   * This function starts up the authorization process.
   * @param {string} personalNumber Personal identity number
   * @param {bool} authenticateOnExternalDevice Will automatically launch BankID app if set to false
   */
  async function handleAuth(
    personalNumber: string,
    authenticateOnExternalDevice: boolean
  ) {
    // Dynamically sets app in dev mode
    if (personalNumber && env.TEST_PERSONAL_NUMBER === personalNumber) {
      handleSetMode("development");
    }

    // Disable BankId authentication
    if (env.USE_BANKID === "false") {
      dispatch(await mockedAuth());
      await handleAddProfile();
      handleLogin();
      return;
    }

    dispatch(setAuthenticateOnExternalDevice(authenticateOnExternalDevice));
    dispatch(setStatus("pending"));
    dispatch(await startAuth(personalNumber, authenticateOnExternalDevice));
  }

  /**
   * This function starts up the sign process.
   * @param {string} personalNumber Personal Identity Number
   * @param {string} userVisibleData Message to be shown when signing order
   * @param {bool} authenticateOnExternalDevice Will automatically launch BankID app if set to false
   */
  async function handleSign(
    personalNumber: string,
    userVisibleData: string,
    authenticateOnExternalDevice: boolean
  ) {
    if (env.USE_BANKID === "false") {
      dispatch(setStatus("signResolved"));
      return;
    }

    dispatch(setStatus("pending"));
    dispatch(
      await startSign(
        personalNumber,
        userVisibleData,
        authenticateOnExternalDevice
      )
    );
  }

  /**
   * This function cancels the authorization process.
   */
  async function handleCancelOrder() {
    dispatch(await cancelOrder(state.orderRef));
  }

  /**
   * This function triggers an action to logout the user and removing the user object.
   */
  const handleLogout = useCallback(async () => {
    dispatch(await loginFailure());
    dispatch(removeProfile());
  }, []);

  /**
   * This function triggers an action to refresh the users session credentials.
   * Only trigger if the user is authenticated already.
   */
  async function handleRefreshSession() {
    if (state.authState === AUTH_STATE.SIGNED_IN) {
      dispatch(await refreshSession());
    }
  }

  /**
   * Set status.
   */
  function handleSetStatus(status: string) {
    dispatch(setStatus(status));
  }

  /**
   * Set error object
   */
  function handleSetError(error: Record<string, unknown>) {
    dispatch(setError(error));
  }

  /**
   * This function checks if the current accessToken is valid.
   */
  const isAccessTokenValid = useCallback(async () => {
    const decodedToken = await authService.getAccessTokenFromStorage();

    // Configure app in dev mode if personalnumber is defined as test account
    if (
      decodedToken?.personalNumber &&
      env.TEST_PERSONAL_NUMBER === decodedToken.personalNumber
    ) {
      handleSetMode("development");
    }

    // TODO: Remove this condition when exp value is set on the jwt token in the api.
    if (env.USE_BANKID === "true" && decodedToken) {
      return true;
    }

    if (decodedToken) {
      // Checks if a token is present in the application and that the expire time of the token is valid
      const expiresAt = decodedToken.exp * 1000;
      return new Date().getTime() < expiresAt;
    }
    return false;
  }, [handleSetMode]);

  useEffect(() => {
    const tryLogin = async () => {
      try {
        dispatch(setStatus("pending"));
        const isValidToken = await isAccessTokenValid();
        if (isValidToken) {
          await handleLogin();
          await handleAddProfile();
        } else {
          await handleLogout();
        }
      } catch (error) {
        await handleLogout();
      }
    };

    void tryLogin();
  }, [isAccessTokenValid, handleLogout]);

  const contextValues = {
    handleLogin,
    handleLogout,
    handleRefreshSession,
    handleAuth,
    handleCancelOrder,
    handleSetStatus,
    handleSign,
    handleSetError,
    isLoading: state.status === "pending",
    isIdle: state.status === "idle",
    isResolved:
      state.status === "authResolved" || state.status === "signResolved",
    isRejected: state.status === "rejected",
    ...state,
  };

  return (
    <AuthContext.Provider value={contextValues}>
      {children}
    </AuthContext.Provider>
  );
}

AuthProvider.propTypes = {
  children: PropTypes.node,
  initialState: PropTypes.shape({}),
};

AuthProvider.defaultProps = {
  initialState: defaultInitialState,
};

export { AuthProvider };
export default AuthContext;
