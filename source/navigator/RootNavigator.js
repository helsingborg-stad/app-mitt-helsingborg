import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { SplashScreen, FormCaseScreen } from 'app/screens';
import AuthStack from './AuthStack';
import BottomBarNavigator from './BottomBarNavigator';

const Stack = createStackNavigator();

const RootStack = () => (
  <Stack.Navigator initialRouteName="Start" screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Start" component={SplashScreen} />
    <Stack.Screen name="Auth" component={AuthStack} />
    <Stack.Screen name="App" component={BottomBarNavigator} />
    <Stack.Screen name="Form" component={FormCaseScreen} />
  </Stack.Navigator>
);

export default RootStack;
