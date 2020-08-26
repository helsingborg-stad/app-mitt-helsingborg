import React from 'react';
import PropTypes from 'prop-types';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

const MockNavigator = ({ component, params }) => (
  <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen name="MockedScreen" component={component} initialParams={params} />
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
