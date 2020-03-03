import { createSwitchNavigator } from 'react-navigation';
import SplashScreen from '../screens/SplashScreen';
import AuthStack from './AuthStack';
import BottomBarNavigator from './BottomBarNavigator';

export const RootStack = {
  Start: SplashScreen,
  Auth: AuthStack,
  App: BottomBarNavigator,
};

export const RootConfig = {
  initialRouteName: 'Start',
};

export default createSwitchNavigator(RootStack, RootConfig);
