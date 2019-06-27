import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import Routes from "../navigation/Routes";
import Navigation from "./shared/Navigation";

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isAuthed: false,
            user: {},
        }
    }

    signOut = (e) => {
        e.preventDefault();
        console.log("Sign out");
        this.setState({
            isAuthed: false
        });
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

    render() {
        return (
            <NativeRouter>
                <View style={styles.body}>
                    {/* Nav for dev purposes, delete me later */}
                    <Navigation
                        signOut={this.signOut}
                    />
                    <Routes
                        {...this.state}
                        loginUser={this.loginUser}
                        resetUser={this.resetUser}
                    />
                </View>
            </NativeRouter>
        )
    }
}

export default App;

const styles = StyleSheet.create({
    body: {
        flex: 1,
        paddingTop: 30,
        backgroundColor: '#C7C7CC',
    }
});
