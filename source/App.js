/* eslint-disable react/state-in-constructor */
/* eslint-disable react/no-unused-state */
/* eslint-disable react/sort-comp */

/**
 * @format
 */

import React, { Component } from 'react';
import Config from 'react-native-config';
import StorybookUIRoot from '../storybook/index';
import { AuthProvider } from './store/AuthContext';
import StoreContext from './helpers/StoreContext';
import Navigator from './navigator';
import StorageService, { COMPLETED_FORMS_KEY } from './services/StorageService';

/**
 * Any setup and init for application goes here:
 * Platform specific handling, global listeners, providers, etc.
 */
export default class App extends Component {
  setBadgeCount = badgeCount => {
    this.setState({ badgeCount });
  };

  state = {
    language: 'en',
    badgeCount: 0,
    setBadgeCount: this.setBadgeCount,
  };

  componentDidMount() {
    this.initApp();
  }

  initApp() {
    // Get badge count for active errands.
    StorageService.getData(COMPLETED_FORMS_KEY).then(value => {
      if (value !== null && value.length >= 0) {
        this.setBadgeCount(value.length);
      }
    });
  }

  render() {
    if (Config.IS_STORYBOOK === 'true') {
      return (
        <StoreContext.Provider value={this.state}>
          <StorybookUIRoot />
        </StoreContext.Provider>
      );
    }

    return (
      <AuthProvider>
        <StoreContext.Provider value={this.state}>
          <Navigator />
        </StoreContext.Provider>
      </AuthProvider>
    );
  }
}
