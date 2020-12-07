/* eslint-disable global-require */
import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { ProfileScreen, HomeScreen } from 'app/screens';
import { TabBarImage } from 'source/components/molecules';
import CaseNavigator from './CaseNavigator';
import TabNavigator from '../components/molecules/TabNavigator';

const Tab = createMaterialTopTabNavigator();
const BottomBarStack = () => (
  <TabNavigator screenOptions={{ headerShown: false }} initialRouteName="UserEvents">
    <Tab.Screen
      name="UserEvents"
      component={CaseNavigator}
      options={{
        title: 'Ärende',
        tabBarIcon: TabBarImage(require('../images/task_3x.png')),
        tabBarIconInactive: TabBarImage(require('../images/task_3x_gray.png')),
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
        tabBarIcon: TabBarImage(require('../images/chat_3x.png')),
        tabBarIconInactive: TabBarImage(require('../images/chat_3x_gray.png')),
      }}
    />
    <Tab.Screen
      name="Profile"
      component={ProfileScreen}
      options={{
        title: 'Profil',
        tabBarIcon: TabBarImage(require('../images/profile_3x.png')),
        tabBarIconInactive: TabBarImage(require('../images/profile_3x_gray.png')),
        tabBarLabel: 'Profil',
      }}
    />
  </TabNavigator>
);
export default BottomBarStack;
