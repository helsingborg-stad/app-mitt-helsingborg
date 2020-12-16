import React, { useContext } from 'react';
import styled from 'styled-components/native';
import {
  NavigationHelpersContext,
  useNavigationBuilder,
  StackRouter,
} from '@react-navigation/native';
import AuthContext from '../store/AuthContext';

const FlexWrapper = styled.View`
  flex: 1;
`;

const CustomStackNavigator = ({
  initialRouteName,
  children,
  screenOptions,
  contentStyle,
}) => {
  const { state, navigation, descriptors } = useNavigationBuilder(StackRouter, {
    children,
    screenOptions,
    initialRouteName,
  });
  const { panResponder } = useContext(AuthContext);

  return (
    <NavigationHelpersContext.Provider value={navigation}>
      <FlexWrapper {...panResponder.panHandlers} style={[contentStyle]}>
        {descriptors[state.routes[state.index].key].render()}
      </FlexWrapper>
    </NavigationHelpersContext.Provider>
  )
}

export default CustomStackNavigator;