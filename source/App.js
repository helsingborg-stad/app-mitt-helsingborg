/* eslint-disable react/state-in-constructor */
/* eslint-disable react/no-unused-state */
/* eslint-disable react/sort-comp */

/**
 * @format
 */

import React from 'react';
import Config from 'react-native-config';
import { Notification } from 'app/store';
import Navigator from './navigator';
import StorybookUIRoot from '../storybook';
import { AuthProvider } from './store/AuthContext';
import { CaseProvider } from './store/CaseContext';

/**
 * Any setup and init for application goes here:
 * Platform specific handling, global listeners, providers, etc.
 */

const App = () => {
  if (Config.IS_STORYBOOK === 'true') {
    return (
      <AuthProvider>
        <CaseProvider>
          <Notification.Provider>
            <StorybookUIRoot />
          </Notification.Provider>
        </CaseProvider>
      </AuthProvider>
    );
  }

  return (
    <AuthProvider>
      <CaseProvider>
        <Notification.Provider>
          <Navigator />
        </Notification.Provider>
      </CaseProvider>
    </AuthProvider>
  );
};

export default App;
