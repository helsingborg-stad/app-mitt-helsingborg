import { ComponentType } from "react";
import env from "react-native-config";

import SentryMonitoringService from "./SentryMonitoringService";
import NullMonitoringService from "./NullMonitoringService";

export interface MonitoringService {
  init: () => void;
  sendError: (Error: Error | string | null) => void;
  wrap: (component: ComponentType<unknown>) => ComponentType<unknown>;
}

class MonitoringServiceFactory {
  static getMonitoringService(environment: string): MonitoringService {
    if (environment === "production") {
      return SentryMonitoringService;
    }

    return NullMonitoringService;
  }
}

export function getMonitoringService(): MonitoringService {
  return MonitoringServiceFactory.getMonitoringService(
    (env.APP_ENV ?? "development") as string
  );
}
