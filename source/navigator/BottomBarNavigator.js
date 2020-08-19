/* eslint-disable global-require */
import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { TabBarImage, MaterialTopTabBarWrapper } from 'source/components/molecules';
import { ProfileScreen, HomeScreen } from 'app/screens';
import TaskNavigator from './TaskNavigator';

const Tab = createMaterialTopTabNavigator();
const BottomBarStack = () => (
  <Tab.Navigator
    screenOptions={{ headerShown: false }}
    initialRouteName="Home"
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
      name="Home"
      component={HomeScreen}
      options={{
        headerTintColor: 'black',
        tabBarLabel: 'Hem',
        title: 'Hem',
        tabBarIcon: TabBarImage(require('../images/home.png')),
      }}
    />
    <Tab.Screen
      name="UserEvents"
      component={TaskNavigator}
      options={{
        title: 'Ärende',
        tabBarIcon: TabBarImage(require('../images/task.png')),
        tabBarLabel: 'Ärende',
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
