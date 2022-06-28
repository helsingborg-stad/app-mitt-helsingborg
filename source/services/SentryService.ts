import * as Sentry from "@sentry/react-native";

import type { MonitoringService } from "./MonitoringService";

const sentryService: MonitoringService = {
  init: () => {
    Sentry.init({
      dsn: "http://16bfc3040f8749598b864a3569df8a05@13.49.35.65:9000/2",
      // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
      // We recommend adjusting this value in production.
      tracesSampleRate: 0.75,
    });
  },
  sendError: (error) => {
    Sentry.captureException(error);
  },
  wrap: (component) => Sentry.wrap(component),
};

export default sentryService;
