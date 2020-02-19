/**
 * @format
 */

import React, { Component } from 'react';
import { AppRegistry } from 'react-native';
import { name as appName } from './app.json';
import Nav from './source/components/Nav';
import StorybookUIRoot from './storybook/index';
import Config from 'react-native-config';
import {YellowBox} from 'react-native';
import StoreContext from "./source/helpers/StoreContext";
import StorageService, {COMPLETED_FORMS_KEY} from "./source/services/StorageService";


//TODO: Replace all imports of AsyncStorage with Community package
YellowBox.ignoreWarnings(['Warning: Async Storage has been extracted from react-native core']);

/**
 * Any setup and init for application goes here:
 * Platform specific handling, global listeners, providers, etc.
 */
export default class MittHbg extends Component {
  setBadgeCount = badgeCount => {
    this.setState({badgeCount})
  };

  state = {
    language: "en",
    badgeCount: 0,
    setBadgeCount: this.setBadgeCount
  };

  componentDidMount() {
    this.initApp()
  }

  initApp() {
    // Get badge count for active errands.
    StorageService.getData(COMPLETED_FORMS_KEY).then((value) => {
      if (value !== null && value.length >= 0) {
        this.setBadgeCount(value.length) ;
      }
    })
  }

  render() {
    if (Config.IS_STORYBOOK === 'false') {
      return (
        <StoreContext.Provider value={this.state}>
          <StorybookUIRoot />
        </StoreContext.Provider>
      )
    }

    return (
      <StoreContext.Provider value={this.state}>
        <Nav />
      </StoreContext.Provider>
    )
  }
}

// const componentToRegister = (Config.IS_STORYBOOK === 'true') ? StorybookUIRoot : MittHbg

AppRegistry.registerComponent(appName, () => MittHbg);
