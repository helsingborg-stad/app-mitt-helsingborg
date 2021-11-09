import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import CalendarScreen from "../screens/bookingScreens/CalendarScreen";

const Stack = createStackNavigator();

const CalendarNavigator = (): JSX.Element => (
  <Stack.Navigator
    screenOptions={{ headerShown: false }}
    initialRouteName="CalendarScreen"
  >
    <Stack.Screen
      name="CalendarScreen"
      component={CalendarScreen}
      options={{ title: "Kalender" }}
    />
  </Stack.Navigator>
);

export default CalendarNavigator;
