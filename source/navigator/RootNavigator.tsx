import React, { useContext } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { SplashScreen, FormCaseScreen, DevFeaturesScreen } from "../screens";
import AuthStack from "./AuthStack";
import CustomStackNavigator from "./CustomStackNavigator";
import BottomBarNavigator from "./BottomBarNavigator";

import FeatureModal from "../screens/featureModalScreens/FeatureModalNavigator";

import AuthContext from "../store/AuthContext";
import AUTH_STATE from "../store/types";

const MainStack = createStackNavigator();
const RootStack = createStackNavigator();

// transition animation that just fades in the screen
const forFade = ({ current }) => ({
  cardStyle: {
    opacity: current.progress,
  },
});

const MainStackScreen = (): JSX.Element => {
  const { authState } = useContext(AuthContext);

  if (authState === AUTH_STATE.PENDING) {
    return <SplashScreen />;
  }

  if (authState === AUTH_STATE.SIGNED_OUT) {
    return <AuthStack />;
  }

  return (
    <CustomStackNavigator
      initialRouteName="App"
      screenOptions={{ headerShown: false }}
    >
      <MainStack.Screen
        name="App"
        component={BottomBarNavigator}
        options={{
          cardStyleInterpolator: forFade,
          gestureEnabled: false,
        }}
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
    </CustomStackNavigator>
  );
};

const RootStackScreen = (): JSX.Element => (
  <RootStack.Navigator
    initialRouteName="Main"
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
