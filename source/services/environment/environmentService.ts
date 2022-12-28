import env from "react-native-config";

import type {
  EnvironmentConfig,
  EnvironmentService,
  RawEnvironmentConfigMap,
} from "./environmentService.types";

export default class DefaultEnvironmentService implements EnvironmentService {
  envSource: Record<string, string> = {};

  environments: Record<string, EnvironmentConfig> = {};

  activeEnvironment: EnvironmentConfig | null = null;

  constructor(envSource: Record<string, string> = env) {
    this.envSource = envSource;
  }

  parse(raw: RawEnvironmentConfigMap): void {
    const entries = Object.entries(raw);

    this.environments = entries.reduce(
      (accumulated, [name, [url, apiKey]]) => ({
        ...accumulated,
        [name]: {
          url,
          apiKey,
        },
      }),
      {} as Record<string, EnvironmentConfig>
    );
  }

  getEnvironments(): Record<string, EnvironmentConfig> {
    return this.environments;
  }

  setActive(environmentName: string): void {
    const environmentNames = Object.keys(this.environments);
    const environmentExists = environmentNames.includes(environmentName);
    if (!environmentExists) {
      throw new Error(
        `Environment '${environmentName}' does not exist in list: ${environmentNames.join(
          ", "
        )}`
      );
    }

    console.log(
      `(EnvironmentService) active environment set to '${environmentName}'`
    );
    this.activeEnvironment = this.environments[environmentName];
  }

  getActive(): EnvironmentConfig {
    if (this.activeEnvironment === null) {
      const fallbackUrl = this.envSource.MITTHELSINGBORG_IO;
      const fallbackApiKey = this.envSource.MITTHELSINGBORG_IO_APIKEY;

      if (!fallbackUrl || !fallbackApiKey) {
        throw new Error(
          "No active environment set and no fallback environment found"
        );
      }

      return {
        url: fallbackUrl,
        apiKey: fallbackApiKey,
      };
    }

    return this.activeEnvironment;
  }
}
