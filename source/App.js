/* eslint-disable react/state-in-constructor */
/* eslint-disable react/no-unused-state */
/* eslint-disable react/sort-comp */
import React from 'react';
import Config from 'react-native-config';
import { ThemeProvider } from 'styled-components/native';
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

const App = () => {
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
