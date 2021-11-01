import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import CalendarScreen from "../screens/CalendarScreen";

const Stack = createStackNavigator();

const CalendarNavigator = () => (
  <Stack.Navigator
    screenOptions={{ headerShown: true }}
    initialRouteName="CalendarScreen"
  >
    <Stack.Screen
      name="CalendarScreen"
      component={CalendarScreen}
      options={{ title: "Kalender", headerShown: false }}
    />
  </Stack.Navigator>
);

export default CalendarNavigator;
