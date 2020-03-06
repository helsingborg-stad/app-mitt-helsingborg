import decode from 'jwt-decode';
import PropTypes from 'prop-types';
import React, { useEffect, useMemo, useReducer } from 'react';
import env from 'react-native-config';
import StorageService, { TOKEN_KEY, USER_KEY } from '../services/StorageService';
import {
  authAndCollect,
  bypassBankid,
  cancelBankidRequest,
  resetCancel,
} from '../services/UserService';

const AuthContext = React.createContext();

const reducer = (prevState, action) => {
  switch (action.type) {
    case 'SIGN_IN':
      return {
        ...prevState,
        authStatus: 'resolved',
        token: action.token,
        user: action.user,
      };
    case 'SIGN_OUT':
      return {
        ...prevState,
        authStatus: 'idle',
        token: null,
        user: null,
      };
    case 'PENDING':
      return {
        ...prevState,
        authStatus: 'pending',
      };
    case 'ERROR':
      return {
        ...prevState,
        authStatus: 'rejected',
        error: action.error,
      };
    default:
      return prevState;
  }
};

function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, {
    authStatus: 'pending',
    token: null,
    user: null,
    error: undefined,
  });

  /**
   * Checks if token is expired
   *
   * @param {string} token JSON Web Token
   * @return {boolean}
   */
  const isTokenExpired = token => {
    try {
      const decoded = decode(token);
      if (decoded.exp > Math.floor(Date.now() / 1000)) {
        return false;
      }
      return true;
    } catch (err) {
      return true;
    }
  };

  /**
   * Logins with mock user credentials
   *
   * @param {string} personalNumber Personal identity number
   */
  const fakeUserLogin = async personalNumber => {
    try {
      const response = await bypassBankid(personalNumber);
      const { user } = response.data;
      await StorageService.saveData(USER_KEY, user);
      await StorageService.saveData(TOKEN_KEY, env.FAKE_TOKEN);
      dispatch({ type: 'SIGN_IN', token: env.FAKE_TOKEN, user });
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    // Get stored token and login user if token is valid
    const bootstrapAsync = async () => {
      const token = await StorageService.getData(TOKEN_KEY);
      const user = await StorageService.getData(USER_KEY);
      const isUserAuthenticated = !!token && !isTokenExpired(token);

      if (isUserAuthenticated) {
        dispatch({ type: 'SIGN_IN', token, user });
        return;
      }

      dispatch({ type: 'SIGN_OUT' });
    };

    bootstrapAsync();
  }, []);

  const authContext = useMemo(
    () => ({
      /**
       * Signs in user and store credentials
       *
       * @param {*} personalNumber Personal identity number
       */
      signIn: async personalNumber => {
        dispatch({ type: 'PENDING' });

        try {
          // Login with fake user (in dev mode)
          if (
            env.FAKE_PERSONAL_NUMBER &&
            personalNumber === env.FAKE_PERSONAL_NUMBER &&
            env.APP_ENV === 'development'
          ) {
            return await fakeUserLogin(personalNumber);
          }

          // Send auth request and collect responses until resolved/rejected
          const authResponse = await authAndCollect(personalNumber);
          if (authResponse.ok !== true) {
            throw new Error(authResponse.data);
          }

          // Destruct user and token variables
          const { user, accessToken: token } = authResponse.data;

          // Check if token is valid
          if (isTokenExpired(token)) {
            throw new Error('Token has expired');
          }

          // Store user and token
          await StorageService.saveData(USER_KEY, user);
          await StorageService.saveData(TOKEN_KEY, token);

          dispatch({ type: 'SIGN_IN', token, user });
        } catch (error) {
          console.log('Sign in error: ', error);
          dispatch({ type: 'ERROR', error });
        }
        // Reset cancel collect parameter
        resetCancel();
      },
      /**
       * Signs out the user
       */
      signOut: async () => {
        await StorageService.removeData(TOKEN_KEY);
        dispatch({ type: 'SIGN_OUT' });
      },
      /**
       * Cancels ongoing sign in process
       */
      cancelSignIn: () => {
        cancelBankidRequest('auth');
        dispatch({ type: 'ERROR', error: new Error('cancelled') });
      },
    }),
    []
  );

  return (
    <AuthContext.Provider value={{ ...authContext, ...state }}>{children}</AuthContext.Provider>
  );
}

AuthProvider.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
};

export { AuthProvider, reducer };
export default AuthContext;
