import React, { useState, useEffect } from "react";
import env from "react-native-config";
import StorageService, {
  APP_ENV_KEY,
} from "../services/storage/StorageService";

interface AppProviderState {
  mode: string;
  handleSetMode(newMode: string): void;
  isDevMode: boolean;
}

const initialState: AppProviderState = {
  mode: "",
  handleSetMode: () => undefined,
  isDevMode: false,
};

const AppContext = React.createContext(initialState);

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

  const provider: AppProviderState = {
    mode,
    handleSetMode,
    isDevMode: mode === "development",
  };

  useEffect(() => {
    void StorageService.saveData(APP_ENV_KEY, mode);
  }, [mode]);

  return <AppContext.Provider value={provider}>{children}</AppContext.Provider>;
}

export { AppProvider };
export default AppContext;
