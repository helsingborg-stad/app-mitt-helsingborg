import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { SplashScreen, FormCaseScreen, DevFeaturesScreen } from '../screens';
import AuthStack from './AuthStack';
import BottomBarNavigator from './BottomBarNavigator';
import CustomStackNavigator from './CustomStackNavigator';

const Stack = createStackNavigator();

// transition animation that just fades in the screen
const forFade = ({ current }) => ({
  cardStyle: {
    opacity: current.progress,
  },
});

const RootStack = () => (
  <CustomStackNavigator initialRouteName="Start" screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Start" component={SplashScreen} />
    <Stack.Screen name="Auth" component={AuthStack} options={{ cardStyleInterpolator: forFade }} />
    <Stack.Screen
      name="App"
      component={BottomBarNavigator}
      options={{ cardStyleInterpolator: forFade, gestureEnabled: false }}
    />
    <Stack.Screen
      name="Form"
      component={FormCaseScreen}
      options={{
        gestureEnabled: false,
      }}
    />
    <Stack.Screen
      name="DevFeatures"
      component={DevFeaturesScreen}
      options={{
        gestureEnabled: false,
      }}
    />
  </CustomStackNavigator>
);

export default RootStack;
