/* eslint-disable global-require */
import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { ProfileScreen, HomeScreen, UserEvents } from 'app/screens';
import { TabBarImage, MaterialTopTabBarWrapper } from 'source/components/molecules';
import CaseNavigator from './CaseNavigator';

const Tab = createMaterialTopTabNavigator();
const BottomBarStack = () => (
  <Tab.Navigator
    screenOptions={{ headerShown: false }}
    initialRouteName="UserEvents"
    tabBarPosition="bottom"
    tabBar={props => <MaterialTopTabBarWrapper {...props} />}
    swipeEnabled
    tabBarOptions={{
      showIcon: true,
      showLabel: true,
      tabStyle: {
        flexDirection: 'row',
      },
    }}
  >
    <Tab.Screen
      name="UserEvents"
      component={CaseNavigator}
      options={{
        title: 'Ärende',
        tabBarIcon: TabBarImage(require('../images/task.png')),
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
        tabBarIcon: TabBarImage(require('../images/home.png')),
      }}
    />
    <Tab.Screen
      name="Profile"
      component={ProfileScreen}
      options={{
        title: 'Profil',
        tabBarIcon: TabBarImage(require('../images/profile.png')),
        tabBarLabel: 'Profil',
      }}
    />
  </Tab.Navigator>
);
export default BottomBarStack;
