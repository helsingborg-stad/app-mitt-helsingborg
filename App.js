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
        marginTop: 30,
    },
    nav: {
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

        return (
            <NativeRouter>
                <View style={styles.body}>
                    <View style={styles.nav}>
                        <Link to="/login" underlayColor="#f0f4f7" style={styles.navItem}>
                            <Text>Logga in</Text>
                        </Link>
                        <Link to="/editlogin" underlayColor="#f0f4f7" style={styles.navItem}>
                            <Text>Ändra inlogg</Text>
                        </Link>
                        <Link to="/" underlayColor="#f0f4f7" style={styles.navItem}>
                            <Text>Start</Text>
                        </Link>
                    </View>

                    <Routes />
                </View>
            </NativeRouter>
        )
    }
}

export default App;
