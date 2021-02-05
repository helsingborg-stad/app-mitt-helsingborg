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
            key={`${index}-${route}`}
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
  children: PropTypes.array,
  screenOptions: PropTypes.any,
  contentStyle: PropTypes.object,
};

export default TabNavigator;
