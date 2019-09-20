import React from 'react';
import {
    createStackNavigator,
    createAppContainer,
    createBottomTabNavigator,
    createSwitchNavigator
} from 'react-navigation';
import AuthLoadingScreen from './screens/AuthLoadingScreen';
import LoginScreen from "./screens/LoginScreen";
import LoginChatScreen from "./screens/LoginChatScreen";
import UserSettingsScreen from "./screens/UserSettingsScreen"
import DashboardScreen from './screens/DashboardScreen';
import SplashScreen from './screens/SplashScreen';
//import ChatScreen from './screens/ChatScreen';

const MittHbgStack = createStackNavigator(
    {
        Dashboard: DashboardScreen
    },
    {
        initialRouteName: "Dashboard",
        defaultNavigationOptions: {
            headerStyle: {
                //backgroundColor: '#f4511e'
            }
        }
    },
);

const SettingStack = createStackNavigator(
    {
        Settings: UserSettingsScreen
    },
    {
        initialRouteName: "Settings",
        defaultNavigationOptions: {
            headerTitle: "Inställningar"
        }
    }
);

// const ChatStack = createStackNavigator(
//     {
//         Chat: ChatScreen
//     },
//     {
//         initialRouteName: "Chat",
//         defaultNavigationOptions: {
//             headerTitle: "Chat Widget"
//         }
//     },
// );

const MainTabs = createBottomTabNavigator({
    MittHelsingborg: {
        screen: MittHbgStack,
        navigationOptions: {
            tabBarLabel: 'Mitt HBG'
        }
    },
    Nav: {
        screen: SettingStack,
        navigationOptions: {
            tabBarLabel: 'Inställningar'
        }
    },
    // Chat: {
    //     screen: ChatStack,
    //     navigationOptions: {
    //         tabBarLabel: 'Chat'
    //     }
    // }
});

const AuthStack = createStackNavigator({
    SignIn: LoginChatScreen
});

const AppContainer = createAppContainer(createSwitchNavigator(
    {
        AuthLoading: AuthLoadingScreen,
        Auth: AuthStack,
        App: MainTabs,
        Splash: SplashScreen,
    },
    {
        initialRouteName: 'Splash',
    }
));

export default class Nav extends React.Component {
    render() {
        return <AppContainer />;
    }
}
