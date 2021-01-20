import PropTypes from 'prop-types';
import React, { useState } from 'react';
import env from 'react-native-config';
import StorageService, { APP_ENV_KEY } from '../services/StorageService';

const AppContext = React.createContext();

function AppProvider({ children }) {
  const acceptedModes = ['development', 'production'];
  const defaultMode = env.APP_ENV || acceptedModes[0];
  const [mode, setMode] = useState(defaultMode);

  const handleSetMode = (newMode) => {
    if (acceptedModes.includes(newMode)) {
      setMode(newMode);
    }
  };

  const provider = {
    mode,
    handleSetMode: (newMode) => handleSetMode(newMode),
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
