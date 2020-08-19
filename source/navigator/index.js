import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import RootNavigator from './RootNavigator';

const Navigator = ({ props }) => (
  <NavigationContainer>
    <RootNavigator />
  </NavigationContainer>
);

export default Navigator;
