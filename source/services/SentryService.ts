import * as Sentry from "@sentry/react-native";
import env from "react-native-config";

import type { MonitoringService } from "./MonitoringService";

const sentryService: MonitoringService = {
  init: () => {
    Sentry.init({
      dsn: env.SENTRY_DSN,
      // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
      // Recommended is to adjust this value in production.
      tracesSampleRate: 0.75,
    });
  },
  sendError: (error) => {
    Sentry.captureException(error);
  },
  wrap: (component) => Sentry.wrap(component),
};

export default sentryService;
