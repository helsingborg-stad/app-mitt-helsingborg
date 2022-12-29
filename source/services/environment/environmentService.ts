import env from "react-native-config";
import type { IStorage } from "../storage/StorageService";

import type {
  EnvironmentConfig,
  EnvironmentService,
  RawEnvironmentConfigMap,
} from "./environmentService.types";

export const ENVIRONMENT_CONFIG_STORAGE_KEY =
  "_DefaultEnvironmentService_environments";

export default class DefaultEnvironmentService implements EnvironmentService {
  private environmentVariablesSource: Record<string, string>;

  private storageService: IStorage;

  private environments: Record<string, EnvironmentConfig> = {};

  private activeEnvironment: EnvironmentConfig | null = null;

  constructor(
    storageService: IStorage,
    envSource: Record<string, string> = env
  ) {
    this.environmentVariablesSource = envSource;
    this.storageService = storageService;
  }

  async parse(raw: RawEnvironmentConfigMap): Promise<void> {
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

    await this.storageService.saveData(
      ENVIRONMENT_CONFIG_STORAGE_KEY,
      JSON.stringify(raw)
    );
  }

  async parseFromStorage(): Promise<void> {
    const stringified = await this.storageService.getData(
      ENVIRONMENT_CONFIG_STORAGE_KEY
    );

    if (stringified) {
      const raw: RawEnvironmentConfigMap = JSON.parse(stringified);
      await this.parse(raw);
    }
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
      const fallbackUrl = this.environmentVariablesSource.MITTHELSINGBORG_IO;
      const fallbackApiKey =
        this.environmentVariablesSource.MITTHELSINGBORG_IO_APIKEY;

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
