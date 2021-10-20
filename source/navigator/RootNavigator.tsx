import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { SplashScreen, FormCaseScreen, DevFeaturesScreen } from "../screens";
import AuthStack from "./AuthStack";
import CustomStackNavigator from "./CustomStackNavigator";
import BottomBarNavigator from "./BottomBarNavigator";

import FeatureModal from "../screens/featureModalScreens/FeatureModalNavigator";

const MainStack = createStackNavigator();
const RootStack = createStackNavigator();

// transition animation that just fades in the screen
const forFade = ({ current }) => ({
  cardStyle: {
    opacity: current.progress,
  },
});

const MainStackScreen = (): JSX.Element => (
  <CustomStackNavigator
    initialRouteName="Start"
    screenOptions={{ headerShown: false }}
  >
    <>
      <MainStack.Screen name="Start" component={SplashScreen} />
      <MainStack.Screen
        name="Auth"
        component={AuthStack}
        options={{ cardStyleInterpolator: forFade }}
      />
      <MainStack.Screen
        name="App"
        component={BottomBarNavigator}
        options={{ cardStyleInterpolator: forFade, gestureEnabled: false }}
      />
      <MainStack.Screen
        name="Form"
        component={FormCaseScreen}
        options={{
          gestureEnabled: false,
        }}
      />
      <MainStack.Screen
        name="DevFeatures"
        component={DevFeaturesScreen}
        options={{
          gestureEnabled: false,
        }}
      />
    </>
  </CustomStackNavigator>
);

const RootStackScreen = (): JSX.Element => (
  <RootStack.Navigator
    mode="modal"
    screenOptions={{
      cardStyle: { backgroundColor: "transparent" },
      headerShown: false,
      cardOverlayEnabled: true,
      cardShadowEnabled: true,
    }}
  >
    <RootStack.Screen
      name="Main"
      component={MainStackScreen}
      options={{ headerShown: false }}
    />

    <RootStack.Screen name="FeatureModal" component={FeatureModal} />
  </RootStack.Navigator>
);

export default RootStackScreen;
