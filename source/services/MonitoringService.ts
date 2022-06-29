import { ComponentType } from "react";
import env from "react-native-config";

import SentryMonitoringService from "./SentryMonitoringService";

export interface MonitoringService {
  init: () => void;
  sendError: (Error: Error | string | null) => void;
  wrap: (component: ComponentType<unknown>) => ComponentType<unknown>;
}

const nullMonitoringService: MonitoringService = {
  init: () => undefined,
  sendError: () => undefined,
  wrap: (component) => component,
};

class MonitoringServiceFactory {
  static getMonitoringService(environment: string): MonitoringService {
    if (environment === "production") {
      return SentryMonitoringService;
    }

    return nullMonitoringService;
  }
}

export function getMonitoringService(): MonitoringService {
  return MonitoringServiceFactory.getMonitoringService(
    (env.APP_ENV ?? "develop") as string
  );
}
