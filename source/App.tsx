import React from "react";
import { Platform, UIManager, I18nManager } from "react-native";
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
import { EnvironmentProvider } from "./store/EnvironmentContext";
import { VivaPeriodProvider } from "./store/VivaPeriodContext";
import { VivaStatusProvider } from "./store/VivaStatusContext";

/**
 * Any setup and init for application goes here:
 * Platform specific handling, global listeners, providers, etc.
 */
const App = (): JSX.Element => {
  try {
    I18nManager.allowRTL(false);
    I18nManager.forceRTL(false);
  } catch (error) {
    console.warn(`Unable to disable RTL: ${error}`);
    getMonitoringService().sendError(error as Error);
  }

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
    <EnvironmentProvider>
      <SafeAreaProvider>
        <AppProvider>
          <AppCompabilityProvider>
            <AuthProvider>
              <VivaPeriodProvider>
                <VivaStatusProvider>
                  <CaseProvider>
                    <FormProvider>
                      <ThemeProvider theme={theme}>
                        <NotificationProvider>
                          <RootComponent />
                        </NotificationProvider>
                      </ThemeProvider>
                    </FormProvider>
                  </CaseProvider>
                </VivaStatusProvider>
              </VivaPeriodProvider>
            </AuthProvider>
          </AppCompabilityProvider>
        </AppProvider>
      </SafeAreaProvider>
    </EnvironmentProvider>
  );
};

export default getMonitoringService().wrap(App);
