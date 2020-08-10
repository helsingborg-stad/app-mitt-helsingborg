import React, { useEffect, useReducer, useCallback } from 'react';
import PropTypes from 'prop-types';
import env from 'react-native-config';
import * as authService from '../services/AuthService';
import AuthReducer, { initialState as defaultInitialState } from './reducers/AuthReducer';
import {
  startAuth,
  cancelAuth,
  loginFailure,
  loginSuccess,
  checkAuthStatus,
  removeProfile,
  addProfile,
  mockedAuth,
} from './actions/AuthActions';

const AuthContext = React.createContext();

function AuthProvider({ children, initialState }) {
  const [state, dispatch] = useReducer(AuthReducer, initialState);

  /**
   * Starts polling for an user authorization response if orderRef and autoStartToken is set in state.
   */
  useEffect(() => {
    const handleCheckAuthStatus = async () => {
      if (state.orderRef && state.autoStartToken && state.isAuthorizing) {
        dispatch(await checkAuthStatus(state.autoStartToken, state.orderRef));
      }
    };
    handleCheckAuthStatus();
  }, [state.orderRef, state.autoStartToken, state.isAuthorizing]);

  /**
   * This function starts up the authorization process.
   * @param {string} ssn Swedish Social Security Number (SSN)
   */
  async function handleAuth(ssn) {
    if (env.USE_BANKID === 'false') {
      dispatch(await mockedAuth());
    } else {
      dispatch(await startAuth(ssn));
    }
  }

  /**
   * This function cancels the authorization process.
   */
  async function handleCancelAuth() {
    dispatch(await cancelAuth(state.orderRef));
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
    dispatch(await loginFailure());
  }

  /**
   * Used to save user profile data to the state.
   * @param {object} profile a user profile object
   */
  async function handleAddProfile() {
    if (env.USE_BANKID === 'true') {
      dispatch(await addProfile());
    }
  }

  /**
   * Used to remove user profile data from the state.
   */
  function handleRemoveProfile() {
    dispatch(removeProfile());
  }

  /**
   * This function checks if the current accessToken is valid.
   */
  async function isUserAuthenticated() {
    const decodedToken = await authService.getAccessTokenFromStorage();
    if (decodedToken) {
      const expiresAt = decodedToken.exp * 1000;
      return new Date().getTime() < expiresAt;
    }
    return false;
  }

  const contextValues = {
    handleLogin,
    handleLogout,
    handleAddProfile,
    handleRemoveProfile,
    handleAuth,
    handleCancelAuth,
    isUserAuthenticated,
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
