import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import {
  TabBarIcon,
  MaterialTopTabBarWrapper,
  BottomBarTabWithBadge,
} from 'app/components/molecules';
import { ChatScreen, ProfileScreen } from 'app/screens';

import TaskNavigator from './TaskNavigator';

export const BottomBarConfig = {
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
};

export const BottomBarStack = {
  Chat: {
    screen: ChatScreen,
    navigationOptions: {
      title: 'Prata med oss',
      tabBarIcon: TabBarIcon('message', '#EC6701'),
    },
    params: {
      tabBarVisible: true,
    },
  },
  UserEvents: {
    screen: TaskNavigator,
    navigationOptions: {
      title: 'Mitt HBG',
      tabBarIcon: BottomBarTabWithBadge('home', '#A61380'),
    },
  },
  Profile: {
    screen: ProfileScreen,
    navigationOptions: {
      title: 'Profil',
      tabBarIcon: TabBarIcon('contacts', '#0095DB'),
    },
  },
};

export default createMaterialTopTabNavigator(BottomBarStack, BottomBarConfig);
