import { ComponentType } from "react";

export interface MonitoringService {
  init: () => void;
  sendError: (Error: Error | string | null) => void;
  wrap: (component: ComponentType<unknown>) => ComponentType<unknown>;
}
