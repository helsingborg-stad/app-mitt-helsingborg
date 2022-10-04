import * as Sentry from "@sentry/react-native";
import env from "react-native-config";

import { deepCopy, setObjectPathValue } from "../../helpers/Objects";

import type { MonitoringService } from "./MonitoringService.types";

const disallowedSentryEventPaths = [
  "contexts.device.name",
  "user.ip_address",
  "user.email",
  "user.username",
];

const sentryMonitoringService: MonitoringService = {
  init: () => {
    Sentry.init({
      dsn: env.SENTRY_DSN,
      // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
      // Recommended is to adjust this value in production.
      tracesSampleRate: 0.75,
      beforeSend: (event) => {
        let eventCopy = deepCopy(event);

        disallowedSentryEventPaths.forEach((path: string) => {
          eventCopy = setObjectPathValue(eventCopy, path, undefined);
        });

        return eventCopy;
      },
    });
  },
  sendError: (error) => {
    Sentry.captureException(error);
  },
  wrap: (component) => Sentry.wrap(component),
};

export default sentryMonitoringService;
