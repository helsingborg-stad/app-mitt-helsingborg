import env from "react-native-config";

import SentryMonitoringService from "./SentryMonitoringService";
import NullMonitoringService from "./NullMonitoringService";

import type { MonitoringService } from "./MonitoringService.types";

class MonitoringServiceFactory {
  static getMonitoringService(environment: string): MonitoringService {
    if (environment === "production") {
      return SentryMonitoringService;
    }

    return NullMonitoringService;
  }
}

export default function getMonitoringService(): MonitoringService {
  return MonitoringServiceFactory.getMonitoringService(
    (env.APP_ENV ?? "development") as string
  );
}
