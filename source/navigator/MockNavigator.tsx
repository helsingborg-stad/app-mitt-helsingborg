import React from "react";
import PropTypes from "prop-types";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { Text } from "react-native";

const Stack = createNativeStackNavigator();

const MockStartScreen = (props) => <Text>Welcome to the start screen</Text>;

const MockNavigator = ({ component, params }) => (
  <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen
        name="MockedScreen"
        component={component}
        initialParams={params}
      />
      <Stack.Screen
        name="Start"
        component={MockStartScreen}
        initialParams={params}
      />
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
