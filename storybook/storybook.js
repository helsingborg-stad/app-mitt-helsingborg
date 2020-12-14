/* eslint-disable import/no-extraneous-dependencies */
import React, { Component } from 'react';
import { AppRegistry } from 'react-native';
import { getStorybookUI, configure } from '@storybook/react-native';
import { loadStories } from './storyLoader';

configure(() => {
  loadStories();
}, module);

const StorybookUI = getStorybookUI({
  port: 7007,
  host: 'localhost',
  onDeviceUI: true,
  resetStorybook: false,
  shouldDisableKeyboardAvoidingView: true,
  asyncStorage: require('@react-native-community/async-storage').default,
});

class StorybookUIHMRRoot extends Component {
  render() {
    return <StorybookUI />;
  }
}

export { StorybookUIHMRRoot as default };
