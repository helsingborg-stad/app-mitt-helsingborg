import SentryMonitoringService from "./SentryMonitoringService";

import type { MonitoringService } from "./MonitoringService.types";

class MonitoringServiceFactory {
  static getMonitoringService(): MonitoringService {
    return SentryMonitoringService;
  }
}

export default function getMonitoringService(): MonitoringService {
  return MonitoringServiceFactory.getMonitoringService();
}
