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

/**
 * Any setup and init for application goes here:
 * Platform specific handling, global listeners, providers, etc.
 */

const App = () => {
  if (Config.IS_STORYBOOK === 'true') {
    return (
      <Notification.Provider>
        <StorybookUIRoot />
      </Notification.Provider>
    );
  }

  return (
    <Notification.Provider>
      <Navigator />
    </Notification.Provider>
  );
};

export default App;
