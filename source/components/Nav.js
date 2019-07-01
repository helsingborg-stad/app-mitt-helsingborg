import React from 'react';
import { View, Button } from 'react-native';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import LoginScreen from "./screens/LoginScreen";
import DashboardScreen from './DashboardScreen';

class NavigationScreen extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isAuthed: false,
        };
    };

    static navigationOptions = () => {
        return {
            headerTitle: 'Navigation'
        }
    };

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

const MainStack = createStackNavigator(
    {
        Navigation: NavigationScreen,
        Login: LoginScreen,
        Dashboard: DashboardScreen
    },
    {
        initialRouteName: "Navigation",
    },
);

const RootStack = createStackNavigator(
    {
        Main: {
            screen: MainStack
        }
    },
    {
        headerMode: 'none',
    }
);

const AppContainer = createAppContainer(RootStack);

export default class App extends React.Component {
    render() {
        return <AppContainer/>;
    }
}
