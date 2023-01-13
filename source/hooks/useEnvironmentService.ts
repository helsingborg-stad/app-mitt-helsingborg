import { useCallback, useEffect, useState } from "react";
import isEqual from "lodash.isequal";
import type {
  EnvironmentConfig,
  EnvironmentConfigMap,
  EnvironmentService,
} from "../services/environment/environmentService.types";
import { serializeEnvironmentConfigMap } from "../services/environment";

interface UseEnvironmentServiceProps {
  service: EnvironmentService;
}

export interface EnvironmentServiceHook {
  environments: EnvironmentConfigMap;
  serializedEnvironmentConfig: string;
  activeEnvironment: EnvironmentConfig;
  setActive(environment: string): void;
  parse(raw: string): Promise<void>;
}

export default function useEnvironmentService({
  service,
}: UseEnvironmentServiceProps): EnvironmentServiceHook {
  const [environments, setEnvironments] = useState<EnvironmentConfigMap>(
    service.getEnvironmentMap()
  );
  const [activeEnvironment, setActiveEnvironment] = useState<EnvironmentConfig>(
    service.getActive()
  );
  const [serializedEnvironmentConfig, setSerializedEnvironmentConfig] =
    useState(serializeEnvironmentConfigMap(environments));

  const setActive = useCallback(
    (environment: string) =>
      service.setActive(environment).then(() => {
        console.log("(environment) active environment set to:", environment);
        setActiveEnvironment(service.getActive());
      }),
    [service]
  );

  const parse = useCallback(
    (raw: string) =>
      service.parse(raw).then(() => {
        setEnvironments(service.getEnvironmentMap());
      }),
    [service]
  );

  useEffect(() => {
    const currentEnvironments = service.getEnvironmentMap();
    if (!isEqual(environments, currentEnvironments)) {
      setEnvironments(currentEnvironments);
    }
  }, [service, environments]);

  useEffect(() => {
    const currentActiveEnvironment = service.getActive();
    if (!isEqual(activeEnvironment, currentActiveEnvironment)) {
      setActiveEnvironment(currentActiveEnvironment);
      console.log(
        "(environment) active environment set to:",
        currentActiveEnvironment.name
      );
    }
  }, [service, activeEnvironment]);

  useEffect(() => {
    setSerializedEnvironmentConfig(serializeEnvironmentConfigMap(environments));
  }, [environments]);

  useEffect(() => {
    void service.parseFromStorage().then(() => {
      console.log("(environment) loaded config from storage");
      const currentEnvironments = service.getEnvironmentMap();
      setEnvironments(currentEnvironments);

      const currentActiveEnvironment = service.getActive();
      setActiveEnvironment(currentActiveEnvironment);
      console.log(
        "(environment) active environment set to:",
        currentActiveEnvironment.name
      );
    });
  }, [service]);

  return {
    environments,
    serializedEnvironmentConfig,
    activeEnvironment,
    parse,
    setActive,
  };
}
