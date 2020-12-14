import React, { useEffect, useReducer, useCallback } from 'react';
import PropTypes from 'prop-types';
import env from 'react-native-config';
import * as authService from '../services/AuthService';
import AuthReducer, { initialState as defaultInitialState } from './reducers/AuthReducer';
import {
  startAuth,
  cancelOrder,
  loginFailure,
  loginSuccess,
  checkOrderStatus,
  removeProfile,
  addProfile,
  mockedAuth,
  startSign,
  setStatus,
  checkIsBankidInstalled,
  updateIsActive,
} from './actions/AuthActions';
import useTouchActivityTimer from '../hooks/useTouchActivityTimer';

const AuthContext = React.createContext();

function AuthProvider({ children, initialState }) {
  const [state, dispatch] = useReducer(AuthReducer, initialState);

  /**
   * Starts polling for an order response if status is pending and orderRef and autoStartToken is set in state.
   */
  useEffect(() => {
    const handleCheckOrderStatus = async () => {
      if (state.status === 'pending' && state.orderRef && state.autoStartToken) {
        dispatch(
          await checkOrderStatus(state.autoStartToken, state.orderRef, state.isAuthenticated)
        );
      }
    };
    handleCheckOrderStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.status, state.orderRef, state.autoStartToken]);

  /**
   * Check if Bankid App is installed on clients machine
   */
  useEffect(() => {
    const handleCheckIsBankidInstalled = async () => {
      dispatch(await checkIsBankidInstalled());
    };

    handleCheckIsBankidInstalled();
  }, []);

  /**
   * This function starts up the authorization process.
   * @param {string} ssn Swedish Social Security Number (SSN)
   * @param {bool} launchBankidApp Will automatically launch BankID app if set to true
   */
  async function handleAuth(ssn, launchBankidApp = true) {
    if (env.USE_BANKID === 'false') {
      dispatch(await mockedAuth());
    } else {
      dispatch(setStatus('pending'));
      dispatch(await startAuth(ssn, launchBankidApp));
    }
  }

  /**
   * This function starts up the sign process.
   * @param {string} personalNumber Personal Identity Number
   * @param {string} userVisibleData Message to be shown when signing order
   */
  async function handleSign(personalNumber, userVisibleData, launchBankidApp = true) {
    if (env.USE_BANKID === 'false') {
      dispatch(setStatus('signResolved'));
      return;
    }

    dispatch(setStatus('pending'));
    dispatch(await startSign(personalNumber, userVisibleData, launchBankidApp));
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

  function handleTouchActivity(date, active) {
    console.log(date, active);
    if (!active) {
      dispatch(updateIsActive(false));
    }
  }

  /**
   * This function triggers an action to logout the user.
   */
  async function handleLogout() {
    dispatch(await loginFailure());
  }

  async function handleContinueSession() {
    dispatch(updateIsActive(true));
  }

  /**
   * Used to save user profile data to the state.
   * @param {object} profile a user profile object
   */
  async function handleAddProfile() {
    dispatch(await addProfile());
  }

  /**
   * Used to remove user profile data from the state.
   */
  function handleRemoveProfile() {
    dispatch(removeProfile());
  }

  /**
   * Used to remove user profile data from the state.
   */
  function handleSetStatus(status) {
    dispatch(setStatus(status));
  }

  /**
   * This function checks if the current accessToken is valid.
   */
  async function isUserAuthenticated() {
    const decodedToken = await authService.getAccessTokenFromStorage();

    // TODO: Remove this condition when exp value is set on the jwt token in the api.
    if (env.USE_BANKID === 'true' && decodedToken) {
      return true;
    }

    if (decodedToken) {
      // Checks if a token is present in the application and that the expire time of the token is valid
      const expiresAt = decodedToken.exp * 1000;
      return new Date().getTime() < expiresAt;
    }
    return false;
  }

  const { panResponder } = useTouchActivityTimer({
    isActive: false,
    onTouchActivity: handleTouchActivity,
    inactivityTimeoutTime: 15000,
  });

  const contextValues = {
    panResponder,
    handleLogin,
    handleLogout,
    handleAddProfile,
    handleRemoveProfile,
    handleAuth,
    handleCancelOrder,
    handleSetStatus,
    isUserAuthenticated,
    handleSign,
    handleContinueSession,
    isLoading: state.status === 'pending',
    isIdle: state.status === 'idle',
    isResolved: state.status === 'authResolved' || state.status === 'signResolved',
    isRejected: state.status === 'rejected',
    ...state,
  };

  return <AuthContext.Provider value={contextValues}>{children}</AuthContext.Provider>;
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
