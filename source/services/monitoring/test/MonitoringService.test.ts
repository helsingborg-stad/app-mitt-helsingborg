import env from "react-native-config";
import * as Sentry from "@sentry/react-native";

import getMonitoringService from "../MonitoringService";

jest.mock("@sentry/react-native", () => ({
  init: jest.fn(),
}));

const dsnMock = "test";

it("returns a null service in development environment", () => {
  env.APP_ENV = "develop";
  const sentrySpy = jest.spyOn(Sentry, "init");

  const service = getMonitoringService();
  service.init();

  expect(sentrySpy).not.toHaveBeenCalled();
});

it("returns sentry service in production environment", () => {
  env.APP_ENV = "production";
  env.SENTRY_DSN = dsnMock;

  const sentrySpy = jest.spyOn(Sentry, "init");

  const service = getMonitoringService();
  service.init();

  expect(sentrySpy).toHaveBeenCalledWith({
    dsn: dsnMock,
    tracesSampleRate: 0.75,
  });
});
