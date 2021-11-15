import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import styled from "styled-components/native";
import { Icon } from "../components/atoms";
import CalendarScreen from "../screens/bookingScreens/CalendarScreen";
import BookingSummary from "../screens/bookingScreens/BookingSummary";

const TouchWrapper = styled.View`
  margin-left: 16px;
  margin-top: 3px;
  padding: 5px;
`;

const Stack = createStackNavigator();

const CalendarNavigator = (): JSX.Element => {
  const BackButton = () => (
    <TouchWrapper>
      <Icon name="arrow-back" />
    </TouchWrapper>
  );

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerBackTitleVisible: false,
        headerBackImage: () => <BackButton />,
      }}
      initialRouteName="CalendarScreen"
    >
      <Stack.Screen
        name="CalendarScreen"
        component={CalendarScreen}
        options={{ title: "Kalender", headerShown: false }}
      />
      <Stack.Screen
        name="BookingSummary"
        component={BookingSummary}
        options={{
          title: "Bokning",
        }}
      />
    </Stack.Navigator>
  );
};

export default CalendarNavigator;
