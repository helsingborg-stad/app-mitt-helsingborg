export type RawEnvironmentConfigMap = Record<string, [string, string]>;

export interface EnvironmentConfig {
  url: string;
  apiKey: string;
}

export interface EnvironmentService {
  parse(raw: RawEnvironmentConfigMap): void;
  getEnvironments(): Record<string, EnvironmentConfig>;
  setActive(environmentName: string): void;
  getActive(): EnvironmentConfig;
}
