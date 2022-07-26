import React from "react";
import { Platform, UIManager } from "react-native";
import Config from "react-native-config";
import { setJSExceptionHandler } from "react-native-exception-handler";
import { ThemeProvider } from "styled-components/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import StorybookUIRoot from "../storybook";
import boundaryErrorHandler from "./helpers/error-handler/ErrorHandler";
import Navigator from "./navigator";
import { AuthProvider } from "./store/AuthContext";
import { AppProvider } from "./store/AppContext";
import { CaseProvider } from "./store/CaseContext";
import { FormProvider } from "./store/FormContext";
import { AppCompabilityProvider } from "./store/AppCompabilityContext";
import { NotificationProvider } from "./store/NotificationContext";
import theme from "./theme/theme";

import getMonitoringService from "./services/monitoring/MonitoringService";

/**
 * Any setup and init for application goes here:
 * Platform specific handling, global listeners, providers, etc.
 */
const App = (): JSX.Element => {
  /**
   * Setup error boundary handler.
   * Set ENABLE_DEV_ERROR_BOUNDARY=true in .env file to enable error boundary in dev mode (non release build of app).
   */
  setJSExceptionHandler(
    boundaryErrorHandler,
    Config.ENABLE_DEV_ERROR_BOUNDARY === "true"
  );

  // turn on layout animation.
  if (Platform.OS === "android") {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(false);
    }
  }

  const RootComponent = () =>
    Config.IS_STORYBOOK === "true" ? <StorybookUIRoot /> : <Navigator />;

  return (
    <SafeAreaProvider>
      <AppProvider>
        <AppCompabilityProvider>
          <AuthProvider>
            <CaseProvider>
              <FormProvider>
                <ThemeProvider theme={theme}>
                  <NotificationProvider>
                    <RootComponent />
                  </NotificationProvider>
                </ThemeProvider>
              </FormProvider>
            </CaseProvider>
          </AuthProvider>
        </AppCompabilityProvider>
      </AppProvider>
    </SafeAreaProvider>
  );
};

export default getMonitoringService().wrap(App);
