/* eslint-disable react/prop-types */
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import LoginScreen from '../components/screens/LoginScreen';
import SplashScreen from '../components/screens/SplashScreen';
import BottomBarStack from './BottomBarStack';

const RootStack = createSwitchNavigator(
  {
    MainApp: BottomBarStack,
    LoginScreen,
    SplashIntro: SplashScreen,
  },
  {
    initialRouteName: 'SplashIntro',
  }
);

export default createAppContainer(RootStack);
