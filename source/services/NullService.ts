import type { MonitoringService } from "./MonitoringService";

const nullService: MonitoringService = {
  init: () => undefined,
  sendError: () => undefined,
  wrap: (component) => component,
};

export default nullService;
