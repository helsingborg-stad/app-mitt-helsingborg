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

/**
 * Any setup and init for application goes here:
 * Platform specific handling, global listeners, providers, etc.
 */

const App = () => {
  if (Config.IS_STORYBOOK === 'true') {
    return (
      <AuthProvider>
        <Notification.Provider>
          <StorybookUIRoot />
        </Notification.Provider>
      </AuthProvider>
    );
  }

  return (
    <AuthProvider>
      <Notification.Provider>
        <Navigator />
      </Notification.Provider>
    </AuthProvider>
  );
};

export default App;
