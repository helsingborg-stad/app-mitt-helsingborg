import { AppRegistry, LogBox } from "react-native";
import env from "react-native-config";

import { name as appName } from "./app.json";
import {
  EnvironmentServiceLocator,
  DefaultEnvironmentService,
} from "./source/services/environment";
import App from "./source/App";
import getMonitoringService from "./source/services/monitoring/MonitoringService";
import { wrappedDefaultStorage } from "./source/services/storage/StorageService";
import { ServiceLocator } from "./source/services/serviceLocator";

import DefaultVivaStatusService from "./source/services/vivaStatus/vivaStatusService";
import DefaultApiService from "./source/services/apiService/apiService";

const envService = new DefaultEnvironmentService(wrappedDefaultStorage, env);
EnvironmentServiceLocator.register(envService);

getMonitoringService().init();

const serviceLocator = ServiceLocator.getInstance();
serviceLocator.register("api", new DefaultApiService());
serviceLocator.register("environment", envService);
serviceLocator.register("vivaStatus", new DefaultVivaStatusService());

// TODO: Fix tab navigation and remove ignore warning.
LogBox.ignoreLogs([
  "VirtualizedLists should never be nested inside plain ScrollViews with the same orientation - use another VirtualizedList-backed container instead.",
]);

AppRegistry.registerComponent(appName, () => App);
