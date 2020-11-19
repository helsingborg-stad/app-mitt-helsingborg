import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import CaseOverview from 'app/screens/caseScreens/CaseOverview';
import CaseSummary from 'app/screens/caseScreens/CaseSummary';
import { Icon } from 'app/components/atoms';
import styled from 'styled-components/native';

const Stack = createStackNavigator();

const BackIcon = styled(Icon)`
  margin-left: 12px;
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
        title: route.params.name,
        headerBackImage: () => <BackIcon name="arrow-back" />,
        headerBackTitle: '',
        headerTruncatedBackTitle: '',
      })}
    />
  </Stack.Navigator>
);

export default CaseNavigator;
