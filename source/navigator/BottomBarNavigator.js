/* eslint-disable global-require */
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import { TabBarImage, MaterialTopTabBarWrapper } from 'app/components/molecules';
import { ProfileScreen, HomeScreen } from 'app/screens';
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
    showLabel: true,
    tabStyle: {
      flexDirection: 'row',
    },
  },
  tabBarComponent: MaterialTopTabBarWrapper,
};

// TODO: make title dynamic
export const BottomBarStack = {
  Chat: {
    screen: HomeScreen,
    navigationOptions: {
      headerTintColor: 'black',
      title: 'Hem',
      tabBarIcon: TabBarImage(require('../images/home.png')),
    },
    params: {
      tabBarVisible: true,
    },
  },
  UserEvents: {
    screen: TaskNavigator,
    navigationOptions: {
      title: 'Ärende',
      tabBarIcon: TabBarImage(require('../images/task.png')),
      tabBarLabel: 'Ärende',
    },
  },

  Profile: {
    screen: ProfileScreen,
    navigationOptions: {
      title: 'Profil',
      tabBarIcon: TabBarImage(require('../images/profile.png')),
      tabBarLabel: 'Profil',
    },
  },
};

export default createMaterialTopTabNavigator(BottomBarStack, BottomBarConfig);
