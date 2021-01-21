import React from 'react';
import PropTypes from 'prop-types';
import { createStackNavigator } from '@react-navigation/stack';
import styled from 'styled-components/native';
import CaseOverview from '../screens/caseScreens/CaseOverview';
import CaseSummary from '../screens/caseScreens/CaseSummary';
import { Icon } from '../components/atoms';

const Stack = createStackNavigator();

const TouchWrapper = styled.TouchableOpacity`
  margin-left: 16px;
  margin-top: 3px;
  border-radius: 17px;
  padding: 5px;
`;

const CaseNavigator = ({ navigation }) => {
  const BackButton = () => (
    <TouchWrapper
      activeOpacity={0.2}
      onPress={() => {
        navigation.navigate('CaseOverview');
      }}
    >
      <Icon name="arrow-back" />
    </TouchWrapper>
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
          headerLeft: () => <BackButton />,
        })}
      />
    </Stack.Navigator>
  );
};
CaseNavigator.propTypes = {
  navigation: PropTypes.object,
};
export default CaseNavigator;
