import React, { useContext } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { SplashScreen, FormCaseScreen, DevFeaturesScreen } from "../screens";
import AuthStack from "./AuthStack";
import CustomStackNavigator from "./CustomStackNavigator";
import BottomBarNavigator from "./BottomBarNavigator";

import FeatureModal from "../screens/featureModalScreens/FeatureModalNavigator";

import AuthContext from "../store/AuthContext";
import { NotifeeProvider } from "../store/NotifeeContext";
import USER_AUTH_STATE from "../types/UserAuthTypes";

const MainStack = createStackNavigator();
const RootStack = createStackNavigator();

// transition animation that just fades in the screen
const forFade = ({ current }) => ({
  cardStyle: {
    opacity: current.progress,
  },
});

const MainStackScreen = ({ navigation }: any): JSX.Element => {
  const { userAuthState } = useContext(AuthContext);

  return (
    <NotifeeProvider
      navigation={navigation}
      isSignedIn={userAuthState === USER_AUTH_STATE.SIGNED_IN}
    >
      <CustomStackNavigator screenOptions={{ headerShown: false }}>
        <>
          {userAuthState === USER_AUTH_STATE.PENDING && (
            <MainStack.Screen name="Start" component={SplashScreen} />
          )}

          {userAuthState === USER_AUTH_STATE.SIGNED_OUT && (
            <MainStack.Screen
              name="Auth"
              component={AuthStack}
              options={{ cardStyleInterpolator: forFade }}
            />
          )}

          {userAuthState === USER_AUTH_STATE.SIGNED_IN && (
            <>
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
            </>
          )}
        </>
      </CustomStackNavigator>
    </NotifeeProvider>
  );
};

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
