/* eslint-disable react/prop-types */
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import LoginScreen from '../components/screens/LoginScreen';
import SplashScreen from '../components/screens/SplashScreen';
import BottomBarNavigator from './BottomBarNavigator';

const RootStack = createSwitchNavigator(
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
