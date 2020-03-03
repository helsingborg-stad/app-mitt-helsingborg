import { createStackNavigator } from 'react-navigation-stack';
import OnboardingScreen from '../screens/OnboardingScreen';
import LoginScreen from '../screens/LoginScreen';

const stack = {
  Onboarding: {
    screen: OnboardingScreen,
    navigationOptions: {
      header: false,
    },
  },
  Login: {
    screen: LoginScreen,
    navigationOptions: {
      header: false,
    },
  },
};

export default createStackNavigator(stack);
