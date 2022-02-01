import PropTypes from "prop-types";
import React, { useState, useEffect } from "react";
import env from "react-native-config";
import StorageService, { APP_ENV_KEY } from "../services/StorageService";

interface Provider {
  mode: string;
  handleSetMode(newMode: string): void;
  isDevMode: boolean;
}

const AppContext = React.createContext<Provider>({
  mode: "",
  handleSetMode: () => undefined,
  isDevMode: false,
});

interface AppProviderProps {
  children?: React.ReactNode;
}

function AppProvider({ children }: AppProviderProps): JSX.Element {
  const acceptedModes = ["development", "production"];
  const defaultMode =
    env.APP_ENV && acceptedModes.includes(env.APP_ENV)
      ? env.APP_ENV
      : acceptedModes[0];
  const [mode, setMode] = useState(defaultMode);

  const handleSetMode = (newMode: string) => {
    if (acceptedModes.includes(newMode)) {
      setMode(newMode);
    }
  };

  const provider: Provider = {
    mode,
    handleSetMode,
    isDevMode: mode === "development",
  };

  useEffect(() => {
    void StorageService.saveData(APP_ENV_KEY, mode);
  }, [mode]);

  return <AppContext.Provider value={provider}>{children}</AppContext.Provider>;
}

AppProvider.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};

export { AppProvider };
export default AppContext;
