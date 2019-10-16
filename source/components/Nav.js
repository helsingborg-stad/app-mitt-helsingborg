import React from 'react';
import {
    createAppContainer,
    createSwitchNavigator
} from 'react-navigation';
import {View, Text, SafeAreaView} from 'react-native';
import {createMaterialTopTabNavigator, MaterialTopTabBar} from 'react-navigation-tabs';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createStackNavigator } from 'react-navigation-stack';
import AuthLoadingScreen from './screens/AuthLoadingScreen';
import LoginChatScreen from "./screens/LoginChatScreen";
import UserSettingsScreen from "./screens/UserSettingsScreen"
import DashboardScreen from './screens/DashboardScreen';
import SplashScreen from './screens/SplashScreen';
import ChatScreen from './screens/ChatScreen';

import {Icon} from 'react-native-elements';

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

// const AuthStack = createStackNavigator({
//     SignIn: LoginChatScreen
// });

// const AppContainer = createAppContainer(createSwitchNavigator(
//     {
//         AuthLoading: AuthLoadingScreen,
//         Auth: AuthStack,
//         App: MainTabs,
//         Splash: SplashScreen,
//     },
//     {
//         initialRouteName: 'Splash',
//     }
// ));

const tabBarIcon = (iconName, colorFocused) => ({focused}) => (
    <Icon name={iconName} color={focused ? colorFocused : 'gray'}/>
);

const MaterialTopTabBarWrapper = props => {
    const {index} = props.navigationState;
    const color =
        index === 0 ? '#EC6701' : index === 1 ? '#A61380' : '#2196f3';

    return (
        <SafeAreaView
            style={{backgroundColor: '#2196f3'}}
            forceInset={{top: 'always', horizontal: 'never', bottom: 'never'}}>
            <MaterialTopTabBar
                {...props}
                activeTintColor={color}
                indicatorStyle={{
                    backgroundColor: color,
                    position: 0
                }}
                style={{backgroundColor: '#fff'}}
                inactiveTintColor='gray'
            />
        </SafeAreaView>
    );
};

const TabNavigator = createMaterialTopTabNavigator({
    Chat: {
        screen: ChatScreen,
        navigationOptions: {
            title: 'Prata med oss',
            tabBarIcon: tabBarIcon('message', '#EC6701')
        },
        params: {
            tabBarVisible: false
        }
    },
    UserEvents: {
        screen: DashboardScreen,
        navigationOptions: {
            title: 'Mitt HBG',
            tabBarIcon: tabBarIcon('home', '#A61380')
        }
    },
    Profile: {
        screen: UserSettingsScreen,
        navigationOptions: {
            title: 'Profil',
            tabBarIcon: tabBarIcon('contacts', 'blue'),
        }
    }
}, {
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
});

const AppContainer = createAppContainer(TabNavigator);

export default class Nav extends React.Component {
    render() {
        return <AppContainer />;
    }
}
