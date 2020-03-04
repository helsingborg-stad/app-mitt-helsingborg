import PropTypes from 'prop-types';
import React, { useReducer, useEffect, useMemo } from 'react';
import decode from 'jwt-decode';
import StorageService, { TOKEN_KEY } from '../services/StorageService';

const AuthContext = React.createContext();

function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'SIGN_IN':
          return {
            ...prevState,
            isAuthenticated: true,
            token: action.token,
            user: action.user,
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            isAuthenticated: false,
            token: null,
            user: null,
          };
        default:
          return prevState;
      }
    },
    {
      isAuthenticated: null,
      token: null,
      user: null,
    }
  );

  /**
   * Checks if token is expired
   */
  const isTokenExpired = token => {
    try {
      const decoded = decode(token);
      if (decoded.exp > Math.floor(Date.now() / 1000)) {
        return false;
      }
      return true;
    } catch (err) {
      console.log('Token is expired!');
      return true;
    }
  };

  useEffect(() => {
    // Get stored token and login if it´s valid
    const bootstrapAsync = async () => {
      const token = await StorageService.getData(TOKEN_KEY);
      const isUserAuthenticated = !!token && !isTokenExpired(token);

      if (isUserAuthenticated) {
        dispatch({ type: 'SIGN_IN', token });
        return;
      }

      dispatch({ type: 'SIGN_OUT' });
    };

    bootstrapAsync();
  }, []);

  const authContext = useMemo(
    () => ({
      signIn: async data => {
        // In a production app, we need to send some data (usually username, password) to server and get a token
        // We will also need to handle errors if sign in failed
        // After getting token, we need to persist the token using `AsyncStorage`
        // In the example, we'll use a dummy token

        dispatch({ type: 'SIGN_IN', token: data.token });
      },
      signOut: () => dispatch({ type: 'SIGN_OUT' }),
    }),
    []
  );

  return (
    <AuthContext.Provider value={{ ...authContext, isAuthenticated: state.isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

AuthProvider.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
};

const AuthConsumer = AuthContext.Consumer;

export { AuthProvider, AuthConsumer };
export default AuthContext;
