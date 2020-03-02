import { createSwitchNavigator } from 'react-navigation';
import { LoginScreen, SplashScreen } from 'app/screens';
import BottomBarNavigator from './BottomBarNavigator';

export const RootStack = {
  MainApp: BottomBarNavigator,
  LoginScreen,
  SplashIntro: SplashScreen,
};

export const RootConfig = {
  initialRouteName: 'SplashIntro',
};

export default createSwitchNavigator(RootStack, RootConfig);
