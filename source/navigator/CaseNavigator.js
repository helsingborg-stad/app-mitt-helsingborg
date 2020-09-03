import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import CaseOverview from 'app/screens/caseScreens/CaseOverview';
import EKBCases from 'app/screens/caseScreens/EKBCases';
import BVCases from 'app/screens/caseScreens/BVCases';
import ServicesMenu from 'app/screens/caseScreens/ServicesMenu';

const Stack = createStackNavigator();

const CaseNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: true }}>
    <Stack.Screen
      name="CaseOverview"
      component={CaseOverview}
      options={{ title: 'Tjänster', headerShown: false }}
    />
    <Stack.Screen
      name="Services"
      component={ServicesMenu}
      options={{ title: 'Tjänster', headerShown: false }}
    />

    <Stack.Screen name="EKBCases" component={EKBCases} options={{ title: 'Ekonomiskt bistånd' }} />
    <Stack.Screen name="BVCases" component={BVCases} options={{ title: 'Borgerlig vigsel' }} />
  </Stack.Navigator>
);

export default CaseNavigator;
