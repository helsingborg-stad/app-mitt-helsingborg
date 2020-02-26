/* eslint-disable react/prop-types */
import React from 'react';
import { SafeAreaView, View } from 'react-native';
import { Icon } from 'react-native-elements';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createMaterialTopTabNavigator, MaterialTopTabBar } from 'react-navigation-tabs';
import styled from 'styled-components/native';
import StoreContext from '../helpers/StoreContext';
import ChatScreen from './screens/ChatScreen';
import LoginScreen from './screens/LoginScreen';
import SplashScreen from './screens/SplashScreen';
import TaskDetailScreen from './screens/TaskDetailScreen';
import TaskScreen from './screens/TaskScreen';
import ProfileScreen from './screens/ProfileScreen';

// TODO: Move Badge to own component file
const Badge = styled.View`
  border-color: #f5f5f5;
  border-width: 2px;
  position: absolute;
  right: -8px;
  top: -10px;
  background-color: #d73640;
  border-radius: 24px;
  width: 20px;
  height: 20px;
  justify-content: center;
  align-items: center;
`;

const BadgeText = styled.Text`
  color: white;
  font-size: 12px;
  font-family: Roboto;
  font-weight: 800;
`;

const tabBarIcon = (iconName, colorFocused) => ({ focused }) => (
  <Icon name={iconName} color={focused ? colorFocused : 'gray'} />
);

const userEventTabWithBadge = (iconName, colorFocused) => ({ focused }) => (
  <StoreContext.Consumer>
    {({ badgeCount }) => (
      <View>
        <Icon name={iconName} color={focused ? colorFocused : 'gray'} />
        {badgeCount > 0 && (
          <Badge>
            <BadgeText>{badgeCount}</BadgeText>
          </Badge>
        )}
      </View>
    )}
  </StoreContext.Consumer>
);

const MaterialTopTabBarWrapper = props => {
  const {
    navigationState: { index },
  } = props;
  let color = '#2196f3';
  color = index === 0 ? '#EC6701' : color;
  color = index === 1 ? '#A61380' : color;

  return (
    <SafeAreaView
      style={{ backgroundColor: '#F8F8F8' }}
      forceInset={{ top: 'always', horizontal: 'never', bottom: 'never' }}
    >
      <MaterialTopTabBar
        {...props}
        activeTintColor={color}
        indicatorStyle={{
          backgroundColor: color,
          display: 'none',
        }}
        style={{ backgroundColor: '#F8F8F8' }}
        inactiveTintColor="gray"
        labelStyle={{ fontSize: 12, fontWeight: '400', fontFamily: 'Roboto' }}
      />
    </SafeAreaView>
  );
};

const TaskScreenStack = createStackNavigator({
  Task: {
    screen: TaskScreen,
    navigationOptions: {
      headerShown: false,
    },
  },

  TaskDetails: {
    screen: TaskDetailScreen,
    navigationOptions: {
      headerShown: false,
    },
  },
});

const TabNavigator = createMaterialTopTabNavigator(
  {
    Chat: {
      screen: ChatScreen,
      navigationOptions: {
        title: 'Prata med oss',
        tabBarIcon: tabBarIcon('message', '#EC6701'),
      },
      params: {
        tabBarVisible: true,
      },
    },
    UserEvents: {
      screen: TaskScreenStack,
      navigationOptions: {
        title: 'Mitt HBG',
        tabBarIcon: userEventTabWithBadge('home', '#A61380'),
      },
    },
    Profile: {
      screen: ProfileScreen,
      navigationOptions: {
        title: 'Profil',
        tabBarIcon: tabBarIcon('contacts', 'blue'),
      },
    },
  },
  {
    initialRouteName: 'Chat',
    tabBarPosition: 'bottom',
    keyboardDismissMode: 'on-drag',
    swipeEnabled: false,
    tabBarOptions: {
      upperCaseLabel: false,
      pressOpacity: 1,
      showIcon: true,
    },
    tabBarComponent: MaterialTopTabBarWrapper,
  }
);

// const AppContainer = createAppContainer(TabNavigator);
const AppContainer = createAppContainer(
  createSwitchNavigator(
    {
      MainApp: TabNavigator,
      LoginScreen,
      SplashIntro: SplashScreen,
    },
    {
      initialRouteName: 'SplashIntro',
    }
  )
);

export default class Nav extends React.Component {
  render() {
    return <AppContainer />;
  }
}
