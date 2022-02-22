import React, { createContext, useContext, useRef } from "react";

import AppContext from "./AppContext";
import getApplicationVersionStatus from "../services/ApplicationVersionService";

import VERSION_STATUS from "../types/VersionStatusTypes";

const AppCompabilityContext = createContext({
  getIsCompatible: () =>
    Promise.resolve({
      isCompatible: true,
      updateUrl: "",
    }),
});

interface Props {
  children: Element | Element[];
}
const AppCompabilityProvider = ({ children }: Props): JSX.Element => {
  const { isDevMode } = useContext(AppContext);

  const isCompatibleRef =
    useRef<{ isCompatible: boolean; updateUrl: string }>();

  const getIsCompatibleValues = async () => {
    const { status, updateUrl } = await getApplicationVersionStatus();

    return {
      isCompatible: status !== VERSION_STATUS.UPDATE_REQUIRED,
      updateUrl,
    };
  };

  const getIsCompatible = async () => {
    if (isDevMode) {
      return { isCompatible: true, updateUrl: "" };
    }

    if (isCompatibleRef.current) {
      return isCompatibleRef.current;
    }

    isCompatibleRef.current = await getIsCompatibleValues();
    return isCompatibleRef.current;
  };

  return (
    <AppCompabilityContext.Provider value={{ getIsCompatible }}>
      {children}
    </AppCompabilityContext.Provider>
  );
};

export default AppCompabilityContext;
export { AppCompabilityProvider };
