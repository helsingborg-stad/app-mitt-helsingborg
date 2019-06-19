
// This is for dev purposes, delete me later

import React, { Component } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { Link } from 'react-router-native';

class Navigation extends Component {
    render() {

        return (
            <View style={styles.nav}>
                <Link to="/login" underlayColor="#f0f4f7" style={styles.navItem}>
                    <Text>Logga in</Text>
                </Link>
                <Link to="/" underlayColor="#f0f4f7" style={styles.navItem}>
                    <Text>Dashboard</Text>
                </Link>

                <View style={styles.navItem} >
                    <Text onPress={this.props.signOut}>Logga ut</Text>
                </View>

            </View>
        )
    }
}

export default Navigation;

const styles = StyleSheet.create({
    nav: {
        flexDirection: "row",
        justifyContent: "space-around"
    },
    navItem: {
        flex: 1,
        alignItems: "center",
        padding: 10,
    }
});
