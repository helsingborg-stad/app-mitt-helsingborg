import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'whitesmoke',
    },
    header: {
        fontSize: 20
    },
});

class EditLogin extends Component {
    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.header}>Ändra inloggning</Text>
            </View>
        );
    }
}

export default EditLogin;
