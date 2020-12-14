/* eslint-disable react/state-in-constructor */
/* eslint-disable react/no-unused-state */
/* eslint-disable react/sort-comp */
/**
 * @format
 */

import { AppRegistry, LogBox } from 'react-native';
import { name as appName } from './app.json';
import App from './source/App';

// TODO: Fix tab navigation and remove ignore warning.
LogBox.ignoreLogs([
  'VirtualizedLists should never be nested inside plain ScrollViews with the same orientation - use another VirtualizedList-backed container instead.',
]);

// const componentToRegister = (Config.IS_STORYBOOK === 'true') ? StorybookUIRoot : MittHbg

AppRegistry.registerComponent(appName, () => App);
