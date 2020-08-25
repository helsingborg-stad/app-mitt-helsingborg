/* eslint-disable react/state-in-constructor */
/* eslint-disable react/no-unused-state */
/* eslint-disable react/sort-comp */
import React from 'react';
import Config from 'react-native-config';
import { Notification } from 'app/store';
import Navigator from './navigator';
import StorybookUIRoot from '../storybook';

import { CaseProvider } from './store/CaseContext';
import { CaseProvider2 } from './store/CaseContext2';
import { AuthProvider } from './store/AuthContext';
import { FormProvider } from './store/FormContext';
/**
 * Any setup and init for application goes here:
 * Platform specific handling, global listeners, providers, etc.
 */

const App = () => {
  if (Config.IS_STORYBOOK == 'true') {
    return (
      <AuthProvider>
        <CaseProvider>
          <CaseProvider2>
            <FormProvider>
              <Notification.Provider>
                <StorybookUIRoot />
              </Notification.Provider>
            </FormProvider>
          </CaseProvider2>
        </CaseProvider>
      </AuthProvider>
    );
  }

  return (
    <AuthProvider>
      <CaseProvider>
        <CaseProvider2>
          <FormProvider>
            <Notification.Provider>
              <Navigator />
            </Notification.Provider>
          </FormProvider>
        </CaseProvider2>
      </CaseProvider>
    </AuthProvider>
  );
};

export default App;
