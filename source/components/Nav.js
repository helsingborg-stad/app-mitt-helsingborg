import React from 'react';
import {View, Text, Button} from 'react-native';
import {createStackNavigator, createAppContainer} from 'react-navigation';
import LoginScreen from "./screens/LoginScreen";

class HomeScreen extends React.Component {
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

    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: 'Home ' + navigation.getParam('extra', ''),
            headerRight: (
                <Button
                    onPress={() => navigation.navigate('MyModal')}
                    title="Conf"
                    color="#fff"
                />
            )
        }
    };

    render() {
        console.log('user defined in nav:');
        console.log(this.state.user);

        const { navigation } = this.props;
        const extraReturned = navigation.getParam('extra', '👾');    // Get extra or default to 👾

        return (
            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                <Text>Home Screen {extraReturned} </Text>
                <Button
                    title="Go to blank screen"
                    onPress={() => this.props.navigation.navigate('Blank')}
                />
                <Button
                    title="Go to blank with inverted header "
                    onPress={() => this.props.navigation.navigate('InvertedHeader')}
                />
                <Button
                    title="Go to detail screen"
                    onPress={() => {
                        this.props.navigation.navigate('Details');
                    }}
                />
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

class DetailScreen extends React.Component {
    static navigationOptions = {
        title: 'Details',
        headerStyle: {
            backgroundColor: '#f4511e',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
            fontWeight: 'bold',
        },
    };

    render() {
        return (
            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                <Text>Details Screen</Text>
                <Button
                    title="Go to Details... again"
                    onPress={() => this.props.navigation.push('Details')}
                />
                <Button
                    title="Go home and take param 🦉 with you"
                    onPress={() => this.props.navigation.navigate('Home', {
                        extra: '🦉',
                    })}
                />
                <Button
                    title="Go back"
                    onPress={() => this.props.navigation.goBack()}
                />
            </View>
        );
    }
}

class BlankScreen extends React.Component {
    render() {
        return (
            <View> </View>
        );
    }
}

class InvertHeaderScreen extends React.Component {
    static navigationOptions = ({ navigation, navigationOptions }) => {
        const { params } = navigation.state;

        return {
            title: params ? params.extraParams : 'Default params',
            headerStyle: {
                backgroundColor: navigationOptions.headerTintColor,
            },
            headerTintColor: navigationOptions.headerStyle.backgroundColor,
        };
    };

    render() {
        return (
            <View> </View>
        );
    }
}

class ModalScreen extends React.Component {
    render() {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontSize: 30 }}>This is a modal!</Text>
                <Button
                    onPress={() => this.props.navigation.goBack()}
                    title="Dismiss"
                />
            </View>
        );
    }
}

const MainStack = createStackNavigator(
    {
        Home: HomeScreen,
        Details: DetailScreen,
        Blank: BlankScreen,
        InvertedHeader: InvertHeaderScreen,
        Login: LoginScreen
    },
    {
        initialRouteName: "Home",
        defaultNavigationOptions: {
            headerStyle: {
                backgroundColor: '#34A853'
            },
            headerTintColor: '#fff',
            headerTitleStyle: 'bold'
        }
    },
);

const RootStack = createStackNavigator(
    {
        Main: {
            screen: MainStack
        },
        MyModal: {
            screen: ModalScreen
        }
    },
    {
        mode: 'modal',
        headerMode: 'none',
    }
);

const AppContainer = createAppContainer(RootStack);

export default class App extends React.Component {
    render() {
        return <AppContainer/>;
    }
}
