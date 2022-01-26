import getApplicationVersionStatus from "app/services/ApplicationVersionService";
import {
  AppCompatibilityContextType,
  AppCompatibilityVisitor,
  ApplicationCompatibilityState,
  APPLICATION_COMPATIBILITY_STATUS,
} from "app/types/AppCompatibilityTypes";
import VERSION_STATUS from "app/types/VersionStatusTypes";
import React, { useContext, useEffect, useState } from "react";
import AppContext from "./AppContext";

interface AppCompatibilityGuardProps {
  children: React.ReactNode | React.ReactNode[];
}

// Create value of context with status and a full
// visitor implementation
const createAppCompatibilityContextValue = (
  state: ApplicationCompatibilityState
) => ({
  visit<T>(visitor: Partial<AppCompatibilityVisitor<T>>): T | undefined {
    switch (state.status) {
      case APPLICATION_COMPATIBILITY_STATUS.COMPATIBLE:
        return visitor?.compatible?.();
      case APPLICATION_COMPATIBILITY_STATUS.PENDING:
        return visitor?.pending?.();
      case APPLICATION_COMPATIBILITY_STATUS.INCOMPATIBLE:
        return visitor?.incompatible?.(state);
      default:
        return undefined;
    }
  },
});

// Hook for requesting application version status
const useCompatibilityHook = () => {
  const { isDevMode } = useContext(AppContext);
  const [state, setState] = useState<ApplicationCompatibilityState>({
    status: APPLICATION_COMPATIBILITY_STATUS.PENDING,
    updateUrl: "",
  });
  let [versionPromise, setVersionPromise] = useState<Promise<any> | null>(null);

  useEffect(() => {
    // we have at most one outstanding call to fetching application version status
    if (versionPromise) {
      return;
    }
    setVersionPromise(async () => {
      if (isDevMode) {
        // in dev mode we defer the whole update logic to mimic
        // production behaviour
        return setState({
          updateUrl: "",
          status: APPLICATION_COMPATIBILITY_STATUS.COMPATIBLE,
        });
      }

      const { status, updateUrl } = await getApplicationVersionStatus();
      const url = String(updateUrl || "");
      switch (status) {
        /*
        case VERSION_STATUS.OK:
          return setState({
            updateUrl: '',
            status: APPLICATION_COMPATIBILITY_STATUS.COMPATIBLE
          })
          case VERSION_STATUS.UPDATE_OPTIONAL:
            return setState({
              updateUrl: '',
              status: APPLICATION_COMPATIBILITY_STATUS.COMPATIBLE
            })
          */
        case VERSION_STATUS.UPDATE_REQUIRED:
          return setState({
            updateUrl: url,
            status: APPLICATION_COMPATIBILITY_STATUS.INCOMPATIBLE,
          });
        default:
          return setState({
            updateUrl: url,
            status: APPLICATION_COMPATIBILITY_STATUS.COMPATIBLE,
          });
      }
    });
  }, [versionPromise]);
  return createAppCompatibilityContextValue(state);
};
const AppCompatibilityContext =
  React.createContext<AppCompatibilityContextType>(
    createAppCompatibilityContextValue({
      status: APPLICATION_COMPATIBILITY_STATUS.PENDING,
      updateUrl: "",
    })
  );

const AppCompatibitityProvider: React.FC<AppCompatibilityGuardProps> = ({
  children,
}: AppCompatibilityGuardProps): JSX.Element => {
  let provider = useCompatibilityHook();
  return (
    <AppCompatibilityContext.Provider value={provider}>
      {children}
    </AppCompatibilityContext.Provider>
  );
};

export default AppCompatibilityContext;
export { AppCompatibitityProvider, createAppCompatibilityContextValue };
