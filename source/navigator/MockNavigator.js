import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Text } from 'react-native';

const Stack = createStackNavigator();

const MockStartScreen = props => <Text>Welcome to the start screen</Text>;

const MockNavigator = ({ component, params }) => (
  <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen name="MockedScreen" component={component} initialParams={params} />
      <Stack.Screen name="Start" component={MockStartScreen} initialParams={params} />
    </Stack.Navigator>
  </NavigationContainer>
);

MockNavigator.propTypes = {
  component: PropTypes.any,
  params: PropTypes.object,
};

MockNavigator.defaultProps = {
  params: {},
};

export default MockNavigator;
