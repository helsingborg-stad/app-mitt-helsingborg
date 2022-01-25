import React, { useEffect, useReducer, useContext, useCallback } from "react";
import PropTypes from "prop-types";
import env from "react-native-config";
import USER_AUTH_STATE from "../types/UserAuthTypes";
import AppContext from "./AppContext";
import * as authService from "../services/AuthService";
import getApiStatus from "../services/ApiStatusService";

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
  setApiStatusMessage,
} from "./actions/AuthActions";

const AuthContext = React.createContext();

function AuthProvider({ children, initialState }) {
  const [state, dispatch] = useReducer(AuthReducer, initialState);

  const { handleSetMode, isDevMode } = useContext(AppContext);

  /**
   * Starts polling for an order response if status is pending and orderRef and autoStartToken is set in state.
   */
  useEffect(() => {
    const handleCheckOrderStatus = async () => {
      if (
        state.status === "pending" &&
        state.orderRef &&
        state.autoStartToken
      ) {
        dispatch(
          await checkOrderStatus(
            state.autoStartToken,
            state.orderRef,
            state.userAuthState === USER_AUTH_STATE.SIGNED_IN
          )
        );
      }
    };
    handleCheckOrderStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.status, state.orderRef, state.autoStartToken]);

  /**
   * This function starts up the authorization process.
   * @param {string} personalNumber Personal identity number
   * @param {bool} authenticateOnExternalDevice Will automatically launch BankID app if set to false
   */
  async function handleAuth(personalNumber, authenticateOnExternalDevice) {
    // Dynamically sets app in dev mode
    if (personalNumber && env.TEST_PERSONAL_NUMBER === personalNumber) {
      handleSetMode("development");
    }

    // Disable BankId authentication
    if (env.USE_BANKID === "false") {
      dispatch(await mockedAuth());
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
    personalNumber,
    userVisibleData,
    authenticateOnExternalDevice
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
   * Dispatch action to set authentication state of the user true
   */
  function handleLogin() {
    dispatch(loginSuccess());
  }

  /**
   * This function triggers an action to logout the user.
   */
  async function handleLogout() {
    removeProfile();
    dispatch(await loginFailure());
  }

  /**
   * This function triggers an action to refresh the users session credentials.
   * Only trigger if the user is authenticated already.
   */
  async function handleRefreshSession() {
    if (state.userAuthState === USER_AUTH_STATE.SIGNED_IN) {
      dispatch(await refreshSession());
    }
  }
  /**
   * Used to save user profile data to the state.
   * @param {object} profile a user profile object
   */
  async function handleAddProfile() {
    dispatch(await addProfile());
  }

  /**
   * Sets API status message in state.
   */
  function handleSetApiStatusMessage(message) {
    dispatch(setApiStatusMessage(message));
  }

  /**
   * Set status.
   */
  function handleSetStatus(status) {
    dispatch(setStatus(status));
  }

  /**
   * Set error object
   */
  function handleSetError(error) {
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
    const trySignIn = async () => {
      try {
        let apiStatusMessage = "";

        if (!isDevMode) {
          apiStatusMessage = await getApiStatus();
        }

        handleSetApiStatusMessage(apiStatusMessage);
        const isValidJWTToken = await isAccessTokenValid();

        const canLogin = isValidJWTToken && !apiStatusMessage;

        if (canLogin) {
          await handleAddProfile();
          handleLogin();
        } else {
          handleLogout();
        }
      } catch (error) {
        handleLogout();
      }
    };

    trySignIn();
  }, [isAccessTokenValid, isDevMode]);

  useEffect(() => {
    const tryFetchUser = async () => {
      try {
        if (
          state.userAuthState === USER_AUTH_STATE.SIGNED_IN &&
          state.user === null
        ) {
          await handleAddProfile();
        }
      } catch (error) {
        handleLogout();
      }
    };

    tryFetchUser();
  }, [state.userAuthState, state.user]);

  const contextValues = {
    handleLogin,
    handleLogout,
    handleRefreshSession,
    handleAddProfile,
    handleAuth,
    handleCancelOrder,
    handleSetStatus,
    isAccessTokenValid,
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
