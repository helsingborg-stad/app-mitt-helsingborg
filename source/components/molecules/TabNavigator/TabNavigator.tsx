import React from 'react';
import PropTypes from 'prop-types';
import { ViewStyle } from 'react-native';
import styled from 'styled-components/native';
import {
  NavigationHelpersContext,
  useNavigationBuilder,
  TabRouter,
} from '@react-navigation/native';
import TabNavigatorItem from './TabNavigatorItem';
import { PrimaryColor } from '../../../styles/themeHelpers';

const BarWrapper = styled.View`
  flex-direction: row;
  justify-content: space-evenly;
  box-shadow: 0px -1px 0px rgba(86, 86, 86, 0.1);
  padding-left: 20px;
  padding-right: 20px;
`;
const FlexWrapper = styled.View`
  flex: 1;
`;

const colors: PrimaryColor[] = ['red', 'green', 'blue'];

interface Props {
  swipeEnabled?: boolean;
  screenOptions?: {
    headerShown?: boolean;
    title?: string;
    tabBarIcon: () => React.ReactNode;
    tabBarIconInactive: () => React.ReactNode;
  };
  initialRouteName: string;
  tabBarStyle: React.CSSProperties;
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
            route={route}
            navigation={navigation}
            descriptor={descriptors[route.key]}
            state={state}
            color={colors[state.index]}
            active={index === state.index}
          />
        ))}
      </BarWrapper>
    </NavigationHelpersContext.Provider>
  );
};

TabNavigator.propTypes = {
  initialRouteName: PropTypes.string.isRequired,
  children: PropTypes.elementType,
  screenOptions: PropTypes.any,
  contentStyle: PropTypes.object,
};

export default TabNavigator;
