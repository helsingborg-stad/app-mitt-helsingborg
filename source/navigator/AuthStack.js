import { createStackNavigator } from 'react-navigation-stack';
import OnboardingScreen from '../screens/OnboardingScreen';
import LoginScreen from '../screens/LoginScreen';

const stack = {
  Onboarding: {
    screen: OnboardingScreen,
    navigationOptions: {
      header: () => {},
    },
  },
  Login: {
    screen: LoginScreen,
    navigationOptions: {
      header: () => {},
    },
  },
};

export default createStackNavigator(stack);
