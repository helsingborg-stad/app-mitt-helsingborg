import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import React from "react";
import { StatusBar } from "react-native";

import TabNavigator from "../components/molecules/TabNavigator";

import { Icon } from "../components/atoms";

import { AboutScreen, ProfileScreen } from "../screens";

import CaseNavigator from "./CaseNavigator";

import ICON from "../assets/images/icons";

import theme from "../theme/theme";
import {
  TabBarImage,
  SafeAreaViewContainer,
} from "./BottomBarNavigator.styled";

const Tab = createMaterialTopTabNavigator();
const BottomBarStack = (): JSX.Element => (
  <SafeAreaViewContainer edges={["right", "bottom", "left"]}>
    <StatusBar
      barStyle="dark-content"
      backgroundColor={theme.colors.neutrals[5]}
    />
    <TabNavigator
      screenOptions={{ headerShown: false }}
      initialRouteName="UserEvents"
    >
      <Tab.Screen
        name="UserEvents"
        component={CaseNavigator}
        options={{
          title: "Ärende",
          tabBarIcon: () => <TabBarImage source={ICON.ICON_TASK} />,
          tabBarIconInactive: () => (
            <TabBarImage source={ICON.ICON_TASK_GRAY} />
          ),
          tabBarLabel: "Ärende",
        }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault();
            navigation.navigate("UserEvents", { screen: "CaseOverview" });
          },
        })}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: "Profil",
          tabBarIcon: () => <TabBarImage source={ICON.ICON_PROFILE} />,
          tabBarIconInactive: () => (
            <TabBarImage source={ICON.ICON_PROFILE_GRAY} />
          ),
          tabBarLabel: "Profil",
        }}
      />
      <Tab.Screen
        name="About"
        component={AboutScreen}
        options={{
          headerTintColor: "black",
          tabBarLabel: "Om",
          title: "Om",
          tabBarIcon: () => <Icon color="#80B14A" name="help-outline" />,
          tabBarIconInactive: () => (
            <Icon color="#A3A3A3" name="help-outline" />
          ),
        }}
      />
    </TabNavigator>
  </SafeAreaViewContainer>
);
export default BottomBarStack;
