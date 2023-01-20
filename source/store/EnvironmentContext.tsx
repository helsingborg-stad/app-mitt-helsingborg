import React from "react";

import type { EnvironmentServiceHook } from "../hooks/useEnvironmentService";
import useEnvironmentService from "../hooks/useEnvironmentService";
import { EnvironmentServiceLocator } from "../services/environment";

export type EnvironmentContext = EnvironmentServiceHook;

export const EnvironmentContext = React.createContext<EnvironmentContext>(
  {} as EnvironmentContext
);

interface EnvironmentProviderProps {
  children: React.ReactNode | React.ReactNode[];
}

export function EnvironmentProvider({
  children,
}: EnvironmentProviderProps): JSX.Element {
  const environmentContext = useEnvironmentService({
    service: EnvironmentServiceLocator.get(),
  });

  return (
    <EnvironmentContext.Provider value={environmentContext}>
      {children}
    </EnvironmentContext.Provider>
  );
}
