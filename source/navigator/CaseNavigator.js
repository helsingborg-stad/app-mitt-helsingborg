import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { CaseArchiveScreen } from 'app/screens';
import CaseOverview from 'app/screens/caseScreens/CaseOverview';

const Stack = createStackNavigator();

const CaseNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    {/* <Stack.Screen name="CaseArchive" component={CaseArchiveScreen} /> */}
    <Stack.Screen name="CaseOverview" component={CaseOverview} />
  </Stack.Navigator>
);

export default CaseNavigator;
