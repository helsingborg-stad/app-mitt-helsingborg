import React, { useContext } from "react";
import { View } from "react-native";
import {
  NavigationHelpersContext,
  useNavigationBuilder,
  StackRouter,
  createNavigatorFactory,
} from "@react-navigation/native";

import MainNavigator from "./MainNavigator";
import FeatureModalNavigator from "../screens/featureModalScreens/FeatureModalNavigator";

import AuthContext from "../store/AuthContext";
import AppContext from "../store/AppContext";
import { NotifeeProvider } from "../store/NotifeeContext";

import USER_AUTH_STATE from "../types/UserAuthTypes";

interface CustomNavigatorInterface {
  children: Element | Element[];
  screenOptions: Record<string, unknown>;
  initialRouteName: string;
}
const CustomNavigator = ({
  children,
  screenOptions,
  initialRouteName,
}: CustomNavigatorInterface) => {
  const { state, navigation, descriptors } = useNavigationBuilder(StackRouter, {
    children,
    screenOptions,
    initialRouteName,
  });

  const { isDevMode } = useContext(AppContext);
  const { userAuthState, user } = useContext(AuthContext);
  const isSignedIn = userAuthState === USER_AUTH_STATE.SIGNED_IN;

  return (
    <NotifeeProvider navigation={navigation} isSignedIn={isSignedIn}>
      <NavigationHelpersContext.Provider value={navigation}>
        <View style={{ flex: 1, backgroundColor: "transparent" }}>
          {state.routes.map((route) => (
            <React.Fragment key={route.key}>
              {descriptors[route.key].render()}
            </React.Fragment>
          ))}
        </View>
      </NavigationHelpersContext.Provider>
    </NotifeeProvider>
  );
};

const createRootCustomNavigator = createNavigatorFactory(CustomNavigator);
const RootCustomNavigator = createRootCustomNavigator();

const RootNavigator = (): JSX.Element => {
  const { userAuthState } = useContext(AuthContext);

  return (
    <RootCustomNavigator.Navigator
      screenOptions={{
        cardStyle: { backgroundColor: "transparent" },
        headerShown: false,
        cardOverlayEnabled: true,
        cardShadowEnabled: true,
      }}
    >
      <RootCustomNavigator.Screen
        name="Main"
        component={MainNavigator}
        options={{ headerShown: false }}
      />
      {userAuthState === USER_AUTH_STATE.SIGNED_IN && (
        <RootCustomNavigator.Screen
          name="FeatureModal"
          component={FeatureModalNavigator}
        />
      )}
    </RootCustomNavigator.Navigator>
  );
};

export default RootNavigator;
