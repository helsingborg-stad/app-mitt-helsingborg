import React from 'react';
import { View, Button } from 'react-native';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import LoginScreen from "./screens/LoginScreen";

class NavigationScreen extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isAuthed: false,
            user: {}
        };
    };

    /**
     * Login a user
     * TODO:
     * - Save user to db and create a session
     */
    loginUser = (user) => {
        console.log(user);

        this.setState({
            user,
            isAuthed: true
        });
    };

    resetUser = () => {
        console.log("reset user");
        this.setState({
            user: {}
        });
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
                        this.props.navigation.navigate('Login', {
                            user: this.state.user,
                            loginUser: this.loginUser,
                            resetUser: this.resetUser
                        });
                    }}
                />
            </View>
        );
    }
}

const MainStack = createStackNavigator(
    {
        Navigation: NavigationScreen,
        Login: LoginScreen
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
