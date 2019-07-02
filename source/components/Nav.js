import React from 'react';
import { View, Button } from 'react-native';
import { createStackNavigator, createAppContainer, createBottomTabNavigator } from 'react-navigation';
import LoginScreen from "./screens/LoginScreen";
import UserSettingsScreen from "./screens/UserSettingsScreen"
import DashboardScreen from './DashboardScreen';

class NavigationScreen extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isAuthed: false,
        };
    };

    // Used when testing for direct navigation between screens.
    render() {
        return (
            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                <Button
                    title="Go to login screen"
                    onPress={() => {
                        this.props.navigation.navigate('Login');
                    }}
                />
            </View>
        );
    }
}

const MittHbgStack = createStackNavigator(
    {
        Navigation: NavigationScreen,
        Login: LoginScreen,
        Dashboard: DashboardScreen
    },
    {
        initialRouteName: "Login",
        defaultNavigationOptions : {
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
    }
});

const AppContainer = createAppContainer(MainTabs);

export default class App extends React.Component {
    render() {
        return <AppContainer/>;
    }
}
