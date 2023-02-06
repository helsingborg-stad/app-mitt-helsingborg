/* eslint-disable import/no-unused-modules */
import React, { useContext, useEffect, useState } from "react";

import AuthContext from "./AuthContext";
import USER_AUTH_STATE from "../types/UserAuthTypes";
import vivaPeriodService from "../services/vivaPeriod/vivaPeriodService";

export interface VivaPeriodContext {
  message: string | null;
}

export const VivaPeriodContext = React.createContext<VivaPeriodContext>(
  {} as VivaPeriodContext
);

interface VivaPeriodProviderProps {
  children: React.ReactNode | React.ReactNode[];
}

export function VivaPeriodProvider({
  children,
}: VivaPeriodProviderProps): JSX.Element {
  const { userAuthState } = useContext(AuthContext);
  const [activeContext, setActiveContext] = useState<VivaPeriodContext>({
    message: null,
  });

  useEffect(() => {
    if (userAuthState === USER_AUTH_STATE.SIGNED_IN) {
      vivaPeriodService
        .getStatusMessage()
        .then((message) => {
          setActiveContext({ message });
        })
        .catch((error) => {
          setActiveContext({ message: null });
          console.error(error);
        });
    } else {
      setActiveContext({ message: null });
    }
  }, [userAuthState]);

  return (
    <VivaPeriodContext.Provider value={activeContext}>
      {children}
    </VivaPeriodContext.Provider>
  );
}
