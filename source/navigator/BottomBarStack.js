import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import ChatScreen from '../components/screens/ChatScreen';
import ProfileScreen from '../components/screens/ProfileScreen';
import TabBarIcon from '../components/molecules/TabBarIcon';
import MaterialTopTabBarWrapper from '../components/molecules/MaterialTopTabBarWrapper';
import BottomBarTabWithBadge from '../components/molecules/BottomBarTabWithBadge';
import TaskStack from './TaskStack';

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

export default BottomBarStack;
