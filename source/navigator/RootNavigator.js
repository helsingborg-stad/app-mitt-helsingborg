import { createSwitchNavigator } from 'react-navigation';
import { SplashScreen, FormCaseScreen } from 'app/screens';

import AuthStack from './AuthStack';
import BottomBarNavigator from './BottomBarNavigator';

export const RootStack = {
  Start: SplashScreen,
  Auth: AuthStack,
  App: BottomBarNavigator,
  Form: FormCaseScreen,
};

export const RootConfig = {
  initialRouteName: 'Start',
};

export default createSwitchNavigator(RootStack, RootConfig);
