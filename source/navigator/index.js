/* eslint-disable react/prop-types */
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import LoginScreen from '../screens/LoginScreen';
import SplashScreen from '../screens/SplashScreen';
import BottomBarNavigator from './BottomBarNavigator';

export const RootStack = createSwitchNavigator(
  {
    MainApp: BottomBarNavigator,
    LoginScreen,
    SplashIntro: SplashScreen,
  },
  {
    initialRouteName: 'SplashIntro',
  }
);

export default createAppContainer(RootStack);
