import PropTypes from "prop-types";
import React, { useState, useEffect } from "react";
import env from "react-native-config";
import StorageService, {
  APP_ENV_KEY,
  API_ENDPOINT,
} from "../services/StorageService";

const AppContext = React.createContext();

function getEndpoint(name) {
  return {
    baseUrl: env[`${name}_MITTHELSINGBORG_IO`] || "",
    apiKey: env[`${name}_MITTHELSINGBORG_IO_APIKEY`] || "",
  };
}

function* getEnvironments() {
  if (!env.API_ENVS) {
    yield {
      label: "DEVELOP",
      value: getEndpoint("DEVELOP"),
      key: 0,
    };
    return;
  }
  const items = env.API_ENVS.split(",");
  for (let i = 0; i < items.length; i += 1) {
    yield {
      label: items[i],
      value: getEndpoint(items[i]),
      key: i,
    };
  }
}

function getDefaultEnvironment(name, items) {
  return (
    items.find((item) => item.label === name) ||
    items.find((item) => item.label === "DEVELOP")
  );
}

function AppProvider({ children }) {
  const acceptedModes = ["development", "production"];
  const defaultMode =
    env.APP_ENV && acceptedModes.includes(env.APP_ENV)
      ? env.APP_ENV
      : acceptedModes[0];
  const [mode, setMode] = useState(defaultMode);

  const handleSetMode = (newMode) => {
    if (acceptedModes.includes(newMode)) {
      setMode(newMode);
    }
  };

  const provider = {
    mode,
    handleSetMode: (newMode) => handleSetMode(newMode),
    isDevMode: mode === "development",
  };

  useEffect(() => {
    StorageService.saveData(APP_ENV_KEY, mode);
  }, [mode]);

  if (provider.isDevMode) {
    provider.targets = Array.from(getEnvironments());
    const selected = getDefaultEnvironment(
      env.DEFAULT_API_ENV,
      provider.targets
    );
    provider.selected = selected.key;

    StorageService.saveData(API_ENDPOINT, selected.value);
  } else {
    StorageService.saveData(API_ENDPOINT, getEndpoint("PRODUCTION"));
  }
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
