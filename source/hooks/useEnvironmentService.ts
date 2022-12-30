import { useCallback, useEffect, useState } from "react";
import isEqual from "lodash.isequal";
import type {
  EnvironmentConfig,
  EnvironmentConfigMap,
} from "../services/environment/environmentService.types";
import { EnvironmentServiceLocator } from "../services/environment";

interface EnvironmentServiceHook {
  environments: EnvironmentConfigMap;
  activeEnvironment: EnvironmentConfig;
  setActive(environment: string): void;
}

export default function useEnvironmentService(): EnvironmentServiceHook {
  const service = EnvironmentServiceLocator.get();

  const [environments, setEnvironments] = useState<EnvironmentConfigMap>(
    service.getEnvironmentMap()
  );
  const [activeEnvironment, setActiveEnvironment] = useState<EnvironmentConfig>(
    service.getActive()
  );

  const setActive = useCallback(
    (environment: string) => {
      void service.setActive(environment);
    },
    [service]
  );

  useEffect(() => {
    const currentEnvironments = service.getEnvironmentMap();
    if (!isEqual(environments, currentEnvironments)) {
      console.log("updating environments to", currentEnvironments);
      setEnvironments(currentEnvironments);
    }

    const currentActiveEnvironment = service.getActive();
    if (!isEqual(activeEnvironment, currentActiveEnvironment)) {
      console.log("updating active environment to", currentActiveEnvironment);
      setActiveEnvironment(currentActiveEnvironment);
    }
  }, [service, activeEnvironment, environments]);

  return {
    environments,
    activeEnvironment,
    setActive,
  };
}
