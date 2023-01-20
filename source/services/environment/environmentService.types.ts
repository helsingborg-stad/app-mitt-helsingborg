export interface EnvironmentConfig {
  name: string;
  url: string;
  apiKey: string;
}

export type RawEnvironmentConfigMap = Record<string, [string, string]>;
export type EnvironmentConfigMap = Record<string, EnvironmentConfig>;
export type SerializedEnvironmentConfigMap = string;

export interface EnvironmentService {
  parse(raw: SerializedEnvironmentConfigMap): Promise<void>;
  parseFromStorage(): Promise<void>;
  getEnvironmentMap(): EnvironmentConfigMap;
  setActive(environmentName: string): Promise<void>;
  getActive(): EnvironmentConfig;
}
