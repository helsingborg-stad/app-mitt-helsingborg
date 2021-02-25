import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
// import OnboardingScreen from '../screens/OnboardingScreen';
import Onboarding from '../screens/onboarding';
import LoginScreen from '../screens/LoginScreen';

const Stack = createStackNavigator();

const AuthStack = () => (
  <Stack.Navigator initialRouteName="Onboarding" screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Onboarding" component={Onboarding} />
    <Stack.Screen name="Login" component={LoginScreen} />
  </Stack.Navigator>
);

export default AuthStack;
