import { createSwitchNavigator } from 'react-navigation';
import SplashScreen from '../screens/SplashScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import BottomBarNavigator from './BottomBarNavigator';

export const RootStack = {
  Starter: SplashScreen,
  Auth: OnboardingScreen,
  MainApp: BottomBarNavigator,
};

export const RootConfig = {
  initialRouteName: 'Starter',
};

export default createSwitchNavigator(RootStack, RootConfig);
