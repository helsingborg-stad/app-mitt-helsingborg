/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NativeRouter, Link } from 'react-router-native';
import Routes from "./source/navigation/Routes";

const styles = StyleSheet.create({
    body: {
        flex: 1,
        marginTop: 25,
    },
    nav: {
        backgroundColor: '#F5FCFF',
        flexDirection: "row",
        justifyContent: "space-around"
    },
    navItem: {
        flex: 1,
        alignItems: "center",
        padding: 10
    },
    subNavItem: {
        padding: 5
    },
    topic: {
        textAlign: "center",
        fontSize: 15
    }
});
class App extends Component {
    render() {
        console.log("hej");

        return (
            <NativeRouter>
                <View style={styles.body}>
                    <View style={styles.nav}>
                        <Link to="/" underlayColor="#f0f4f7" style={styles.navItem}>
                            <Text>Home</Text>
                        </Link>
                        <Link to="/login" underlayColor="#f0f4f7" style={styles.navItem}>
                            <Text>Login</Text>
                        </Link>
                    </View>

                    <Routes />
                </View>
            </NativeRouter>
        )
    }
}

export default App;
