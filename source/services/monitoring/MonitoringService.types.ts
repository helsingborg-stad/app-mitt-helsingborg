import type { ComponentType } from "react";

export interface MonitoringService {
  init: () => void;
  sendError: (Error: Error | string | null | undefined) => void;
  wrap: (component: ComponentType<unknown>) => ComponentType<unknown>;
}
