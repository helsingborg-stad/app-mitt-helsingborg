import PropTypes from 'prop-types';
import React, { useState } from 'react';
import env from 'react-native-config';
import StorageService, { APP_ENV_KEY } from '../services/StorageService';

const AppContext = React.createContext();

function AppProvider({ children }) {
  const defaultMode = env.APP_ENV || 'development';
  const [mode, setMode] = useState(defaultMode);

  const provider = {
    mode,
    handleSetMode: (newMode) => setMode(newMode),
    isDevMode: mode === 'development',
  };

  React.useEffect(() => {
    StorageService.saveData(APP_ENV_KEY, mode);
  }, [mode]);

  return <AppContext.Provider value={provider}>{children}</AppContext.Provider>;
}

AppProvider.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
};

export { AppProvider };
export default AppContext;
