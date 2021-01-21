import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import styled from 'styled-components/native';
import { TouchableOpacity, Platform } from 'react-native';
import CaseOverview from '../screens/caseScreens/CaseOverview';
import CaseSummary from '../screens/caseScreens/CaseSummary';
import { Icon } from '../components/atoms';
import theme from '../styles/theme';

const Stack = createStackNavigator();

const BackIcon = styled(Icon)`
  ${Platform.OS === 'ios' && 'margin-left: 16px;'}
`;

const CaseNavigator = ({ navigation }) => {
  const BackButton = () => (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('CaseOverview');
      }}
    >
      <BackIcon name="arrow-back" />
    </TouchableOpacity>
  );
  return (
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
          // headerBackImage: () => <BackIcon name="arrow-back" />,
          headerLeft: () => <BackButton />,
          headerBackTitle: '',
          headerTruncatedBackTitle: '',
          headerStyle: {
            backgroundColor: theme.colors.neutrals[5],
          },
        })}
      />
    </Stack.Navigator>
  );
};

export default CaseNavigator;
