/* eslint-disable global-require */
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';
import { Icon } from '../components/atoms';
import TabNavigator from '../components/molecules/TabNavigator';
import { AboutScreen, ProfileScreen } from '../screens';
import theme from '../styles/theme';
import CaseNavigator from './CaseNavigator';

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
    <StatusBar barStyle="dark-content" backgroundColor={theme.colors.neutrals[5]} />
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
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault();
            navigation.navigate('UserEvents', { screen: 'CaseOverview' });
          },
        })}
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
      <Tab.Screen
        name="About"
        component={AboutScreen}
        options={{
          headerTintColor: 'black',
          tabBarLabel: 'Om',
          title: 'Om',
          tabBarIcon: () => <Icon color="#80B14A" name="help-outline" />,
          tabBarIconInactive: () => <Icon color="#A3A3A3" name="help-outline" />,
        }}
      />
    </TabNavigator>
  </SafeAreaViewContainer>
);
export default BottomBarStack;
