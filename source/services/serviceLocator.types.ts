import type { ApiService } from "./apiService/apiService.types";
import type { EnvironmentService } from "./environment/environmentService.types";
import type { VivaStatusService } from "./vivaStatus/vivaStatusService.types";

export type ServiceTypes = {
  environment: EnvironmentService;
  vivaStatus: VivaStatusService;
  api: ApiService;
};

export interface IServiceLocator {
  register<K extends keyof ServiceTypes>(id: K, value: ServiceTypes[K]): void;
  get<K extends keyof ServiceTypes>(id: K): ServiceTypes[K];
}
