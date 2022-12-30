export type RawEnvironmentConfigMap = Record<string, [string, string]>;

export interface EnvironmentConfig {
  name: string;
  url: string;
  apiKey: string;
}

export type EnvironmentConfigMap = Record<string, EnvironmentConfig>;

export interface EnvironmentService {
  parse(raw: RawEnvironmentConfigMap): Promise<void>;
  parseFromStorage(): Promise<void>;
  getEnvironmentMap(): EnvironmentConfigMap;
  setActive(environmentName: string): Promise<void>;
  getActive(): EnvironmentConfig;
}
