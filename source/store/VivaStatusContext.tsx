import React from "react";

import { ServiceLocator } from "../services/serviceLocator";
import useVivaStatusService from "../hooks/useVivaStatusService";

import type { VivaStatusService } from "../services/vivaStatus/vivaStatusService.types";

type VivaStatusContext = VivaStatusService;

const VivaStatusContext = React.createContext<VivaStatusContext>(
  {} as VivaStatusContext
);

interface VivaStatusProviderProps {
  children: React.ReactNode;
}

export function VivaStatusProvider({
  children,
}: VivaStatusProviderProps): JSX.Element {
  const serviceInstance = useVivaStatusService({
    service: ServiceLocator.getInstance().get("vivaStatus"),
  });

  return (
    <VivaStatusContext.Provider value={serviceInstance}>
      {children}
    </VivaStatusContext.Provider>
  );
}
