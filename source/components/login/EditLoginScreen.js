import React, { Component } from 'react';
import { StyleSheet, TextInput, Text, View, Switch } from 'react-native';

class EditLoginScreen extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={styles.container}>

                <Text style={styles.label}>Personnummer</Text>
                <TextInput
                    style={styles.inputField}
                    onChangeText={(value) => this.props.setPno(value)}
                    value={this.props.appSettings.pno}
                />

                <Text style={styles.label}>Switch me</Text>
                <Switch style={styles.switch} />

                <Text style={styles.label}>Läs mer om hur du skaffar mobilt BankID.</Text>
            </View>
        );
    }
}

export default EditLoginScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        padding: 16,
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
    },
    switch: {
        marginBottom: 16,
    },
    inputField: {
        height: 48,
        borderColor: '#ddd',
        borderWidth: 1,
        marginBottom: 16,
        borderRadius: 5,
        paddingLeft: 8,
        backgroundColor: '#fff'
    },
});
