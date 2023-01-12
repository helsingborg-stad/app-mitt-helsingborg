import env from "react-native-config";
import type { IStorage } from "../storage/StorageService";
import {
  deserializeEnvironmentConfigMap,
  serializeEnvironmentConfigMap,
} from "./environmentConfigMapSerializer";

import type {
  EnvironmentConfig,
  EnvironmentConfigMap,
  EnvironmentService,
  SerializedEnvironmentConfigMap,
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

  getActiveEnvironmentName(): Promise<string | null> {
    return this.storageService.getData(ACTIVE_ENVIRONMENT_STORAGE_KEY);
  }

  async loadActiveFromStorage(): Promise<void> {
    const active = await this.getActiveEnvironmentName();

    if (active) {
      await this.setActive(active);
    }
  }

  async parse(raw: SerializedEnvironmentConfigMap): Promise<void> {
    if (raw?.length > 0) {
      this.environments = deserializeEnvironmentConfigMap(raw);
    } else {
      this.environments = {};
    }

    await this.storageService.saveData(
      ENVIRONMENT_CONFIG_STORAGE_KEY,
      serializeEnvironmentConfigMap(this.environments)
    );

    const activeEnvironmentName = await this.getActiveEnvironmentName();
    const activeEnvironmentExists =
      !!activeEnvironmentName &&
      Object.keys(this.environments).includes(activeEnvironmentName);

    if (!activeEnvironmentExists) {
      const firstActiveName = Object.keys(this.environments).sort()[0] ?? "";
      await this.setActive(firstActiveName);
    }
  }

  async parseFromStorage(): Promise<void> {
    const serialized = await this.storageService.getData(
      ENVIRONMENT_CONFIG_STORAGE_KEY
    );

    if (serialized) {
      await this.parse(serialized);
    }
  }

  getEnvironmentMap(): EnvironmentConfigMap {
    return this.environments;
  }

  async setActive(environmentName: string): Promise<void> {
    if (environmentName?.length === 0) {
      this.activeEnvironment = null;
    } else {
      const environmentNames = Object.keys(this.environments);
      const environmentExists = environmentNames.includes(environmentName);
      if (!environmentExists) {
        throw new Error(
          `Environment '${environmentName}' does not exist in list: ${environmentNames.join(
            ", "
          )}`
        );
      }

      this.activeEnvironment = this.environments[environmentName];
      console.log(
        "(EnvironmentService) Active environment set to",
        environmentName
      );
    }

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
