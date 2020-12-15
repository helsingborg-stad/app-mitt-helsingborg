import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import styled from 'styled-components/native';
import { Platform } from 'react-native';
import CaseOverview from '../screens/caseScreens/CaseOverview';
import CaseSummary from '../screens/caseScreens/CaseSummary';
import { Icon } from '../components/atoms';

const Stack = createStackNavigator();

const BackIcon = styled(Icon)`
  ${Platform.OS === 'ios' && 'margin-left: 16px;'}
`;

const CaseNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: true }}>
    <Stack.Screen
      name="CaseOverview"
      component={CaseOverview}
      options={{ title: 'Ärenden', headerShown: false }}
    />
    <Stack.Screen
      name="CaseSummary"
      component={CaseSummary}
      options={({ route }) => ({
        title: route.params.name || 'Ärenden',
        headerBackImage: () => <BackIcon name="arrow-back" />,
        headerBackTitle: '',
        headerTruncatedBackTitle: '',
      })}
    />
  </Stack.Navigator>
);

export default CaseNavigator;
