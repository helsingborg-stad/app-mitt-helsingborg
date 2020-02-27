import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import ChatScreen from '../screens/ChatScreen';
import ProfileScreen from '../screens/ProfileScreen';
import TabBarIcon from '../components/molecules/TabBarIcon';
import MaterialTopTabBarWrapper from '../components/molecules/MaterialTopTabBarWrapper';
import BottomBarTabWithBadge from '../components/molecules/BottomBarTabWithBadge';
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
      tabBarIcon: TabBarIcon('contacts', 'blue'),
    },
  },
};

export default createMaterialTopTabNavigator(BottomBarStack, BottomBarConfig);
