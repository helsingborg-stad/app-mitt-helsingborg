import React from 'react';
import { Platform, UIManager } from 'react-native';
import Config from 'react-native-config';
import { setJSExceptionHandler } from 'react-native-exception-handler';
import { ThemeProvider } from 'styled-components/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import StorybookUIRoot from '../storybook';
import boundaryErrorHandler from './helpers/error-handler/ErrorHandler';
import Navigator from './navigator';
import { AuthProvider } from './store/AuthContext';
import { CaseProvider } from './store/CaseContext';
import { FormProvider } from './store/FormContext';
import { NotificationProvider } from './store/NotificationContext';
import theme from './styles/theme';

/**
 * Any setup and init for application goes here:
 * Platform specific handling, global listeners, providers, etc.
 */

const App = () => {
  /**
   * Setup error boundary handler.
   * Set ENABLE_DEV_ERROR_BOUNDARY=true in .env file to enable error boundary in dev mode (non release build of app).
   */
  setJSExceptionHandler(boundaryErrorHandler, Config.ENABLE_DEV_ERROR_BOUNDARY === 'true');

  // turn on layout animation.
  if (Platform.OS === 'android') {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }
  if (Config.IS_STORYBOOK === 'true') {
    return (
      <SafeAreaProvider>
        <AuthProvider>
          <CaseProvider>
            <FormProvider>
              <ThemeProvider theme={theme}>
                <NotificationProvider>
                  <StorybookUIRoot />
                </NotificationProvider>
              </ThemeProvider>
            </FormProvider>
          </CaseProvider>
        </AuthProvider>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <CaseProvider>
          <FormProvider>
            <ThemeProvider theme={theme}>
              <NotificationProvider>
                <Navigator />
              </NotificationProvider>
            </ThemeProvider>
          </FormProvider>
        </CaseProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
};

export default App;
