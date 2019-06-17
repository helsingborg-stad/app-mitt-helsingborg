import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { NativeRouter } from 'react-router-native';
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

    setUser(user) {
        this.setState({
            user,
            isAuthed: true
        });
    }

    setPno(pno) {
        this.setState({
            pno
        });
    }

    render() {
        return (
            <NativeRouter>
                <View style={styles.body}>
                    {/* Nav for dev purposes, delete me later */}
                    <Navigation />
                    <Routes
                        {...this.state}
                        setUser={this.setUser.bind(this)}
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
