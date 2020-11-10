/* eslint-disable react/state-in-constructor */
/* eslint-disable react/no-unused-state */
/* eslint-disable react/sort-comp */
import React from 'react';
import { Platform, UIManager } from 'react-native';
import Config from 'react-native-config';
import { ThemeProvider } from 'styled-components/native';
import { setJSExceptionHandler, setNativeExceptionHandler } from 'react-native-exception-handler';
import Navigator from './navigator';
import StorybookUIRoot from '../storybook';
import theme from './styles/theme';

import { CaseProvider } from './store/CaseContext';
import { AuthProvider } from './store/AuthContext';
import { FormProvider } from './store/FormContext';
import { NotificationProvider } from './store/NotificationContext';
/**
 * Any setup and init for application goes here:
 * Platform specific handling, global listeners, providers, etc.
 */
// Handler for app crashes
const errorHandler = (error, isFatal) => {
  if (isFatal) {
    // TODO: Handle fatal errors: Splash screen and error log.
    console.log('Error!');
  } else {
    // Error has been notified
    console.warn(error);
  }
};

const App = () => {
  setJSExceptionHandler(errorHandler);
  // turn on layout animation.
  if (Platform.OS === 'android') {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }
  if (Config.IS_STORYBOOK === 'true') {
    return (
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
    );
  }

  return (
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
  );
};

export default App;
