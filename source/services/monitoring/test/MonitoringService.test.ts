import env from "react-native-config";
import * as Sentry from "@sentry/react-native";

import getMonitoringService from "../MonitoringService";

jest.mock("@sentry/react-native", () => ({
  init: jest.fn(),
}));

const dsnMock = "test";

it("returns a monitoring service", () => {
  env.SENTRY_DSN = "test";

  const sentrySpy = jest.spyOn(Sentry, "init");

  const service = getMonitoringService();
  service.init();

  expect(sentrySpy).toHaveBeenCalledWith({
    dsn: dsnMock,
    tracesSampleRate: 0.75,
  });
});
