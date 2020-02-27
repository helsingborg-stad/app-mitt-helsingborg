import { createSwitchNavigator } from 'react-navigation';
import LoginScreen from '../screens/LoginScreen';
import SplashScreen from '../screens/SplashScreen';
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
