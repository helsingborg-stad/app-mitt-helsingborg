import PropTypes from 'prop-types';
import React, { useReducer, useEffect, useMemo } from 'react';
import decode from 'jwt-decode';
import StorageService, { TOKEN_KEY } from '../services/StorageService';

const AuthContext = React.createContext();

function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_SESSION':
          return {
            ...prevState,
            isAuthenticated: action.isAuthenticated,
            isLoading: false,
          };
        case 'SIGN_IN':
          return {
            ...prevState,
            isSignout: false,
            isAuthenticated: true,
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            isSignout: true,
            isAuthenticated: false,
          };
        default:
          return prevState;
      }
    },
    {
      isLoading: true,
      isSignout: false,
      isAuthenticated: null,
    }
  );

  /**
   * Check if token is expired
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
    /**
     * Checks if there is a saved token and is still valid
     */
    const isUserAuthenticated = async () => {
      const token = await StorageService.getData(TOKEN_KEY);
      return !!token && !isTokenExpired(token);
    };
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      const authenticated = await isUserAuthenticated();

      dispatch({ type: 'RESTORE_SESSION', isAuthenticated: authenticated });
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

        dispatch({ type: 'SIGN_IN' });
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
