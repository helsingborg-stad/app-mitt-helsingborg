/* eslint-disable react/prop-types */
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import ChatScreen from './components/screens/ChatScreen';
import LoginScreen from './components/screens/LoginScreen';
import SplashScreen from './components/screens/SplashScreen';
import TaskDetailScreen from './components/screens/TaskDetailScreen';
import TaskScreen from './components/screens/TaskScreen';
import ProfileScreen from './components/screens/ProfileScreen';
import TabBarIcon from './components/molecules/TabBarIcon';
import MaterialTopTabBarWrapper from './components/molecules/MaterialTopTabBarWrapper';
import BottomBarTabWithBadge from './components/molecules/BottomBarTabWithBadge';

const TaskStack = createStackNavigator({
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

const BottomBarStack = createMaterialTopTabNavigator(
  {
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
      screen: TaskStack,
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

const RootStack = createSwitchNavigator(
  {
    MainApp: BottomBarStack,
    LoginScreen,
    SplashIntro: SplashScreen,
  },
  {
    initialRouteName: 'SplashIntro',
  }
);

const AppNavigation = createAppContainer(RootStack);

export { TaskStack, BottomBarStack, RootStack };

export default AppNavigation;
