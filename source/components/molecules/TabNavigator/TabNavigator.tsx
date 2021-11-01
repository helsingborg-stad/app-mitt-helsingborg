import React from "react";
import { ViewStyle } from "react-native";
import styled from "styled-components/native";
import {
  NavigationHelpersContext,
  useNavigationBuilder,
  TabRouter,
} from "@react-navigation/native";
import TabNavigatorItem from "./TabNavigatorItem";
import { ThemeType } from "../../../styles/themeHelpers";

interface BarWrapperProps {
  theme: ThemeType;
}
const BarWrapper = styled.View<BarWrapperProps>`
  background-color: ${(props) => props.theme.colors.neutrals[5]};
  border-top-color: ${(props) => props.theme.border.default};
  border-top-width: 1px;
  flex-direction: row;
  justify-content: space-evenly;
  padding-left: 20px;
  padding-right: 20px;
`;

const FlexWrapper = styled.View`
  flex: 1;
`;

const colorsDictionary: Record<string, string> = {
  UserEvents: "red",
  Calendar: "red",
  Profile: "blue",
  About: "green",
};

interface Props {
  screenOptions?: {
    headerShown?: boolean;
    title?: string;
    tabBarIcon: () => React.ReactNode;
    tabBarIconInactive: () => React.ReactNode;
  };
  initialRouteName: string;
  contentStyle: ViewStyle;
  children: React.ReactNode;
}

const TabNavigator: React.FC<Props> = ({
  initialRouteName,
  children,
  screenOptions,
  contentStyle,
}) => {
  const { state, navigation, descriptors } = useNavigationBuilder(TabRouter, {
    children,
    screenOptions,
    initialRouteName,
  });

  return (
    <NavigationHelpersContext.Provider value={navigation}>
      <FlexWrapper style={[contentStyle]}>
        {descriptors[state.routes[state.index].key].render()}
      </FlexWrapper>
      <BarWrapper>
        {state.routes.map((route, index) => (
          <TabNavigatorItem
            key={`TabNavigatorItem-${route}`}
            route={route}
            navigation={navigation}
            descriptor={descriptors[route.key]}
            state={state}
            color={colorsDictionary[route.name]}
            active={index === state.index}
          />
        ))}
      </BarWrapper>
    </NavigationHelpersContext.Provider>
  );
};

export default TabNavigator;
