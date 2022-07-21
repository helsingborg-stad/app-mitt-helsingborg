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

export const useAppCompabilityHook = (
  fetchVersionStatus: () => Promise<{
    status: VERSION_STATUS;
    updateUrl: string;
  }>
): {
  getIsCompatible: () => Promise<{ isCompatible: boolean; updateUrl: string }>;
} => {
  const { isDevMode } = useContext(AppContext);

  const isCompatibleRef = useRef<{
    isCompatible: boolean;
    updateUrl: string;
  }>();

  const getIsCompatibleValues = async () => {
    const { status, updateUrl } = await fetchVersionStatus();

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

  return { getIsCompatible };
};

const AppCompabilityProvider = ({
  children,
}: {
  children: JSX.Element | JSX.Element[];
}): JSX.Element => {
  const value = useAppCompabilityHook(getApplicationVersionStatus);

  return (
    <AppCompabilityContext.Provider value={value}>
      {children}
    </AppCompabilityContext.Provider>
  );
};

export default AppCompabilityContext;
export { AppCompabilityProvider };
