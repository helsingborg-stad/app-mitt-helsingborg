import { AppRegistry, LogBox } from "react-native";
import { name as appName } from "./app.json";
import App from "./source/App";

import { getMonitoringService } from "./source/services/MonitoringService";

getMonitoringService().init();

// TODO: Fix tab navigation and remove ignore warning.
LogBox.ignoreLogs([
  "VirtualizedLists should never be nested inside plain ScrollViews with the same orientation - use another VirtualizedList-backed container instead.",
]);

AppRegistry.registerComponent(appName, () => App);
