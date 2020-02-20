/* eslint-disable react/display-name */
/* eslint-disable no-unused-vars */
/* eslint-disable no-nested-ternary */
/* eslint-disable global-require */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable import/no-named-as-default */
/* eslint-disable react/prop-types */
/* eslint-disable no-use-before-define */
/* eslint-disable import/no-named-as-default-member */
import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { View, Text, SafeAreaView, Image, StyleSheet } from 'react-native';
import {
  createMaterialTopTabNavigator,
  MaterialTopTabBar,
  createBottomTabNavigator,
} from 'react-navigation-tabs';

import { createStackNavigator } from 'react-navigation-stack';
import { Icon } from 'react-native-elements';
import UserSettingsScreen from './screens/UserSettingsScreen';
import DashboardScreen from './screens/DashboardScreen';
import SplashScreen from './screens/SplashScreen';
import ChatScreen from './screens/ChatScreen';
import TaskScreen from './screens/TaskScreen';
import TaskDetailScreen from './screens/TaskDetailScreen';

import LoginScreen from './screens/LoginScreen';
import StoreContext from '../helpers/StoreContext';

// const MittHbgStack = createStackNavigator(
//     {
//         Dashboard: DashboardScreen
//     },
//     {
//         initialRouteName: "Dashboard",
//         defaultNavigationOptions: {
//             headerStyle: {
//                 //backgroundColor: '#f4511e'
//             }
//         }
//     },
// );

// const SettingStack = createStackNavigator(
//     {
//         Settings: UserSettingsScreen
//     },
//     {
//         initialRouteName: "Settings",
//         defaultNavigationOptions: {
//             headerTitle: "Inställningar"
//         }
//     }
// );

// const MainTabs = createBottomTabNavigator({
//     MittHelsingborg: {
//         screen: MittHbgStack,
//         navigationOptions: {
//             tabBarLabel: 'Mitt HBG'
//         }
//     },
//     Nav: {
//         screen: SettingStack,
//         navigationOptions: {
//             tabBarLabel: 'Inställningar'
//         }
//     }
// });

const tabBarIcon = (iconName, colorFocused) => ({ focused }) => (
  <Icon name={iconName} color={focused ? colorFocused : 'gray'} />
);

const userEventTabWithBadge = (iconName, colorFocused) => ({ focused }) => (
  <StoreContext.Consumer>
    {({ badgeCount }) => (
      <View>
        <Icon name={iconName} color={focused ? colorFocused : 'gray'} />
        {badgeCount > 0 && (
          <View style={styles.UserEventTabView}>
            <Text style={styles.UserEventTabBadge}>{badgeCount}</Text>
          </View>
        )}
      </View>
    )}
  </StoreContext.Consumer>
);

const MaterialTopTabBarWrapper = props => {
  const { index } = props.navigationState;
  const color = index === 0 ? '#EC6701' : index === 1 ? '#A61380' : '#2196f3';

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
      header: null,
    },
  },

  TaskDetails: {
    screen: TaskDetailScreen,
    navigationOptions: {
      header: null,
    },
  },
});

const TabNavigator = createMaterialTopTabNavigator(
  {
    // SplashIntro: {
    //     screen: SplashScreen,
    //     navigationOptions: {
    //         tabBarVisible: false
    //     }
    // },
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
      screen: () => (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Image
            style={styles.ProfileMockImage}
            source={require('../assets/screenshot_profile.png')}
          />
        </View>
      ),
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

const styles = StyleSheet.create({
  ProfileMockImage: {
    width: '100%',
    height: '100%',
  },
  UserEventTabView: {
    borderColor: '#F5F5F5',
    borderWidth: 2,
    position: 'absolute',
    right: -8,
    top: -10,
    backgroundColor: '#D73640',
    borderRadius: 24,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  UserEventTabBadge: {
    color: 'white',
    fontSize: 12,
    fontFamily: 'Roboto',
    fontWeight: '800',
  },
});
