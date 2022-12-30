import env from "react-native-config";
import type { IStorage } from "../storage/StorageService";

import type {
  EnvironmentConfig,
  EnvironmentConfigMap,
  EnvironmentService,
  RawEnvironmentConfigMap,
} from "./environmentService.types";

export const ENVIRONMENT_CONFIG_STORAGE_KEY =
  "@DefaultEnvironmentService:environments";
export const ACTIVE_ENVIRONMENT_STORAGE_KEY =
  "@DefaultEnvironmentService:active";

export default class DefaultEnvironmentService implements EnvironmentService {
  private environmentVariablesSource: Record<string, string>;

  private storageService: IStorage;

  private environments: EnvironmentConfigMap = {};

  private activeEnvironment: EnvironmentConfig | null = null;

  constructor(
    storageService: IStorage,
    envSource: Record<string, string> = env
  ) {
    this.environmentVariablesSource = envSource;
    this.storageService = storageService;
  }

  async loadActiveFromStorage(): Promise<void> {
    const active = await this.storageService.getData(
      ACTIVE_ENVIRONMENT_STORAGE_KEY
    );

    if (active) {
      console.log("(EnvironmentService) loaded active from storage:", active);
      await this.setActive(active);
    }
  }

  async parse(raw: RawEnvironmentConfigMap): Promise<void> {
    const entries = Object.entries(raw);

    this.environments = entries.reduce(
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

    await this.storageService.saveData(
      ENVIRONMENT_CONFIG_STORAGE_KEY,
      JSON.stringify(raw)
    );

    await this.loadActiveFromStorage();
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

  getEnvironmentMap(): EnvironmentConfigMap {
    return this.environments;
  }

  async setActive(environmentName: string): Promise<void> {
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
      "(EnvironmentService) active environment set to:",
      environmentName
    );
    this.activeEnvironment = this.environments[environmentName];

    await this.storageService.saveData(
      ACTIVE_ENVIRONMENT_STORAGE_KEY,
      environmentName
    );
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
        name: "default",
        url: fallbackUrl,
        apiKey: fallbackApiKey,
      };
    }

    return this.activeEnvironment;
  }
}
