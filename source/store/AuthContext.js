import decode from 'jwt-decode';
import PropTypes from 'prop-types';
import React, { useEffect, useMemo, useReducer } from 'react';
import env from 'react-native-config';
import { getMessage } from 'app/helpers/MessageHelper';
import StorageService, { TOKEN_KEY, USER_KEY } from '../services/StorageService';
import { authAndCollect, getUser, getMockUser, cancelBankidRequest } from '../services/UserService';
import bankid from '../services/BankidService';
import { get, post } from '../helpers/ApiRequest';

const AuthContext = React.createContext();

async function grantAccessToken(ssn) {
  try {
    const response = await post(
      '/auth/token',
      { personalNumber: ssn },
      { 'x-api-key': env.MITTHELSINGBORG_IO_APIKEY }
    );

    if (response.status !== 200) {
      return { success: false, data: 'Cannot authorize user' };
    }

    return { success: true, data: response.data.data.attributes };
  } catch (error) {
    console.error('Token Auth Error:', error);
    return { success: false, data: error };
  }
}

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
        user: {},
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
    case 'CANCEL':
      return {
        ...prevState,
        authStatus: 'canceled',
      };
    default:
      return prevState;
  }
};

function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, {
    authStatus: 'pending',
    token: null,
    user: {},
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
   */
  const fakeUserLogin = async () => {
    try {
      const user = getMockUser();
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

  /**
   * Signs in user and store credentials
   * @param {string} ssn Swedish Social Security Number
   */
  async function signIn(ssn) {
    console.log(ssn);
    try {
      dispatch({ type: 'PENDING' });
      if (
        env.FAKE_PERSONAL_NUMBER &&
        ssn === env.FAKE_PERSONAL_NUMBER &&
        env.APP_ENV === 'development'
      ) {
        return await fakeUserLogin(ssn);
      }

      const bankidAuthResponse = await bankid.auth(ssn);

      if (bankidAuthResponse.success === false) {
        throw new Error(bankidAuthResponse.data);
      }

      const bankidCollectResponse = await bankid.collect(bankidAuthResponse.data.order_ref);
      if (bankidCollectResponse.success === false) {
        throw new Error(bankidCollectResponse.data);
      }

      console.log(bankidCollectResponse);

      const tokenResponse = await grantAccessToken(ssn);

      console.log('TOKEN_RESPONSE:', tokenResponse);

      await StorageService.saveData(TOKEN_KEY, tokenResponse.data.token);

      const userResponse = await get(`/users/${ssn}`, {
        Authorization: tokenResponse.data.token,
      });
      console.log('USER_DATA', userResponse);
      // Store user and token
      await StorageService.saveData(USER_KEY, userResponse.data);

      dispatch({
        type: 'SIGN_IN',
        token: tokenResponse.data.token,
        user: userResponse.data,
      });
    } catch (error) {
      dispatch({ type: 'ERROR', error });
    }
  }

  async function signOut() {
    dispatch({ type: 'SIGN_OUT' });
    await StorageService.removeData(TOKEN_KEY);
  }

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
          const { user, token } = authResponse.data;

          // Check if token is valid
          if (isTokenExpired(token)) {
            console.log('Sign in error: Token has expired');
            throw new Error(getMessage('technicalError'));
          }

          // Get user data from database
          // TODO: Get user with token instead of sending personal number
          const { ok: userOk, data: userData } = await getUser(user.personal_number);
          if (userOk !== true) {
            throw new Error(userData);
          }

          // Store user and token
          await StorageService.saveData(USER_KEY, userData);
          await StorageService.saveData(TOKEN_KEY, token);

          dispatch({ type: 'SIGN_IN', token, user: userData });
        } catch (error) {
          console.log('Sign in error: ', error);
          dispatch({ type: 'ERROR', error });
        }
      },
      /**
       * Signs out the user
       */
      signOut: async () => {
        dispatch({ type: 'SIGN_OUT' });
        await StorageService.removeData(TOKEN_KEY);
      },
      /**
       * Cancels ongoing sign in process
       */
      cancelSignIn: () => {
        cancelBankidRequest('auth');
        dispatch({ type: 'CANCEL' });
      },
    }),
    []
  );

  return (
    <AuthContext.Provider value={{ signIn, signOut, ...state }}>{children}</AuthContext.Provider>
  );
}

AuthProvider.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
};

export { AuthProvider, reducer };
export default AuthContext;
