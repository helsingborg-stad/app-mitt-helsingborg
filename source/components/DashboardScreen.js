import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        fontSize: 20
    },
});

class DashboardScreen extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { user } = this.props;

        return (
            <View style={styles.container}>
                <Text style={styles.header}>Greetings {user.givenName}!</Text>
                <Text style={{ fontSize: 70 }}>🧙‍♂️</Text>
            </View >
        );
    }
}

export default DashboardScreen;
