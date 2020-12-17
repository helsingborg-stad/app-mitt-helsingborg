/* eslint-disable global-require */
import React from 'react';
import styled from 'styled-components/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ProfileScreen, HomeScreen } from '../screens';
import CaseNavigator from './CaseNavigator';
import TabNavigator from '../components/molecules/TabNavigator';

const TabBarImage = styled.Image`
  width: 25px;
  height: 25px;
`;

const SafeAreaViewContainer = styled(SafeAreaView)`
  flex: 1;
  background-color: ${(props) => props.theme.colors.neutrals[5]};
`;

const Tab = createMaterialTopTabNavigator();
const BottomBarStack = () => (
  <SafeAreaViewContainer edges={['right', 'bottom', 'left']}>
    <TabNavigator screenOptions={{ headerShown: false }} initialRouteName="UserEvents">
      <Tab.Screen
        name="UserEvents"
        component={CaseNavigator}
        options={{
          title: 'Ärende',
          tabBarIcon: () => <TabBarImage source={require('../images/task_3x.png')} />,
          tabBarIconInactive: () => <TabBarImage source={require('../images/task_3x_gray.png')} />,
          tabBarLabel: 'Ärende',
        }}
      />
      <Tab.Screen
        name="Chat"
        component={HomeScreen}
        options={{
          headerTintColor: 'black',
          tabBarLabel: 'Sally',
          title: 'Sally',
          tabBarIcon: () => <TabBarImage source={require('../images/chat_3x.png')} />,
          tabBarIconInactive: () => <TabBarImage source={require('../images/chat_3x_gray.png')} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Profil',
          tabBarIcon: () => <TabBarImage source={require('../images/profile_3x.png')} />,
          tabBarIconInactive: () => (
            <TabBarImage source={require('../images/profile_3x_gray.png')} />
          ),
          tabBarLabel: 'Profil',
        }}
      />
    </TabNavigator>
  </SafeAreaViewContainer>
);
export default BottomBarStack;
