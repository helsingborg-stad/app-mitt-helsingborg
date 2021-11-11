import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import styled from "styled-components/native";
import { Icon } from "../components/atoms";
import CalendarScreen from "../screens/bookingScreens/CalendarScreen";
import BookingSummary from "../screens/bookingScreens/BookingSummary";

const TouchWrapper = styled.TouchableOpacity`
  margin-left: 16px;
  margin-top: 3px;
  border-radius: 17px;
  padding: 5px;
`;

const Stack = createStackNavigator();

interface CalendarNavigatorProps {
  navigation: any;
}

const CalendarNavigator = ({
  navigation,
}: CalendarNavigatorProps): JSX.Element => {
  const BackButton = () => (
    <TouchWrapper
      activeOpacity={0.2}
      onPress={() => {
        navigation.navigate("CaseOverview");
      }}
    >
      <Icon name="arrow-back" />
    </TouchWrapper>
  );

  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="CalendarScreen"
    >
      <Stack.Screen
        name="CalendarScreen"
        component={CalendarScreen}
        options={{ title: "Kalender" }}
      />
      <Stack.Screen
        name="BookingSummary"
        component={BookingSummary}
        options={{
          title: "Bokning",
          headerLeft: () => <BackButton />,
        }}
      />
    </Stack.Navigator>
  );
};

export default CalendarNavigator;
