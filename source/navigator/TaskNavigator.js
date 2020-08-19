import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { CaseArchiveScreen } from 'app/screens';

const Stack = createStackNavigator();

const CaseNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="CaseArchive" component={CaseArchiveScreen} />
  </Stack.Navigator>
);

export default CaseNavigator;
