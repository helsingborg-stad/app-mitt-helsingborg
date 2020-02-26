/* eslint-disable react/state-in-constructor */
/* eslint-disable react/no-unused-state */
/* eslint-disable react/sort-comp */

/**
 * @format
 */

import React, { Component } from 'react';
import { YellowBox } from 'react-native';
import Config from 'react-native-config';
import AppNavigation from './Navigation';
import StorybookUIRoot from '../../storybook/index';

import StoreContext from '../helpers/StoreContext';
import StorageService, { COMPLETED_FORMS_KEY } from '../services/StorageService';

// TODO: Fix tab navigation and remove ignore warning.
YellowBox.ignoreWarnings([
  'VirtualizedLists should never be nested inside plain ScrollViews with the same orientation - use another VirtualizedList-backed container instead.',
]);

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
      <StoreContext.Provider value={this.state}>
        <AppNavigation />
      </StoreContext.Provider>
    );
  }
}
