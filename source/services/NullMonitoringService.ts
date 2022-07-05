import type { MonitoringService } from "./MonitoringService";

const nullMonitoringService: MonitoringService = {
  init: () => undefined,
  sendError: () => undefined,
  wrap: (component) => component,
};

export default nullMonitoringService;
