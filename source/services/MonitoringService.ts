import { ComponentType } from "react";

import SentryService from "./SentryService";
import NullService from "./NullService";

export interface MonitoringService {
  init: () => void;
  sendError: (Error: Error | string | null) => void;
  wrap: (component: ComponentType<unknown>) => ComponentType<unknown>;
}

class MonitoringServiceFactory {
  static getMonitoringService(environment: string): MonitoringService {
    if (environment === "develop") {
      return SentryService;
    }

    return NullService;
  }
}

export function getMonitoringService(): MonitoringService {
  return MonitoringServiceFactory.getMonitoringService(
    (process.env.APP_ENV ?? "develop") as string
  );
}
