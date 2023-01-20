import type {
  EnvironmentConfigMap,
  RawEnvironmentConfigMap,
  SerializedEnvironmentConfigMap,
} from "./environmentService.types";

export function environmentConfigMapToRawEnvironmentConfigMap(
  input: EnvironmentConfigMap
): RawEnvironmentConfigMap {
  const environmentEntries = Object.entries(input);
  return environmentEntries.reduce(
    (accumulated, [environmentName, environmentConfig]) => ({
      ...accumulated,
      [environmentName]: [environmentConfig.url, environmentConfig.apiKey],
    }),
    {} as RawEnvironmentConfigMap
  );
}

export function rawEnvironmentConfigMapToEnvironmentConfigMap(
  input: RawEnvironmentConfigMap
): EnvironmentConfigMap {
  const entries = Object.entries(input);

  return entries.reduce(
    (accumulated, [name, [url, apiKey]]) => ({
      ...accumulated,
      [name]: {
        name,
        url,
        apiKey,
      },
    }),
    {} as EnvironmentConfigMap
  );
}

export function deserializeEnvironmentConfigMap(
  input: SerializedEnvironmentConfigMap
): EnvironmentConfigMap {
  const raw: RawEnvironmentConfigMap = JSON.parse(input);
  return rawEnvironmentConfigMapToEnvironmentConfigMap(raw);
}

export function serializeEnvironmentConfigMap(
  input: EnvironmentConfigMap
): SerializedEnvironmentConfigMap {
  const raw = environmentConfigMapToRawEnvironmentConfigMap(input);
  return JSON.stringify(raw);
}
