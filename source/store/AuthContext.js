import decode from 'jwt-decode';
import React, { useEffect, useReducer, useCallback } from 'react';
import env from 'react-native-config';
import StorageService, { TOKEN_KEY, USER_KEY } from '../services/StorageService';
import { getMockUser } from '../services/UserService';

import AuthReducer, { initialState } from './reducers/AuthReducer';
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

function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(AuthReducer, initialState);

  // /**
  //  * Logins with mock user credentials
  //  */
  // const fakeUserLogin = async () => {
  //   try {
  //     const user = getMockUser();
  //     await StorageService.saveData(USER_KEY, user);
  //     await StorageService.saveData(TOKEN_KEY, env.FAKE_TOKEN);
  //     dispatch({ type: 'SIGN_IN', payload: { token: env.FAKE_TOKEN, user } });
  //   } catch (e) {
  //     console.log(e);
  //   }
  // };

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
  const handleLogin = useCallback(() => {
    dispatch(loginSuccess());
  }, []);

  /**
   * This function triggers an action to logout the user.
   */
  const handleLogout = useCallback(() => {
    dispatch(loginFailure());
  }, []);

  /**
   * Used to save user profile data to the state.
   * @param {object} profile a user profile object
   */
  const handleAddProfile = useCallback(profile => {
    dispatch(addProfile(profile));
  }, []);

  /**
   * Used to remove user profile data from the state.
   */
  const handleRemoveProfile = useCallback(() => {
    dispatch(removeProfile());
  }, []);

  /**
   * This function checks if the current accessToken is valid.
   */
  async function isUserAuthenticated() {
    const token = await StorageService.getData('token');
    if (token) {
      const decoded = decode(token);
      const expiresAt = decoded.exp * 1000;
      return new Date().getTime() < expiresAt;
    }
    return false;
  }

  // /**
  //  * Signs in user and store credentials
  //  * @param {string} ssn Swedish Social Security Number
  //  */
  // async function signIn(ssn) {
  //   try {
  //     dispatch({ type: 'UPDATE_STATUS', payload: { status: 'pending' } });
  //     if (
  //       env.FAKE_PERSONAL_NUMBER &&
  //       ssn === env.FAKE_PERSONAL_NUMBER &&
  //       env.APP_ENV === 'development'
  //     ) {
  //       return await fakeUserLogin(ssn);
  //     }

  //     const bankidAuthResponse = await bankid.auth(ssn);
  //     if (bankidAuthResponse.success === false) {
  //       throw new Error(bankidAuthResponse.data);
  //     }

  //     dispatch({ type: 'SET_ORDER_REF', payload: { orderRef: bankidAuthResponse.data.order_ref } });

  //     const bankidCollectResponse = await bankid.collect(bankidAuthResponse.data.order_ref);
  //     if (bankidCollectResponse.success === false) {
  //       throw new Error(bankidCollectResponse.data);
  //     }

  //     const tokenResponse = await grantAccessToken(ssn);

  //     await StorageService.saveData(TOKEN_KEY, tokenResponse.data.token);

  //     const userProfile = await getProfile(ssn);
  //     await StorageService.saveData(USER_KEY, userProfile);

  //     dispatch({
  //       type: 'SIGN_IN',
  //       payload: {
  //         token: tokenResponse.data.token,
  //         user: userProfile,
  //       },
  //     });
  //   } catch (error) {
  //     dispatch({ type: 'ERROR', payload: { error } });
  //   }
  // }

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

export { AuthProvider };
export default AuthContext;
