import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const Button = ({ value, onClick, modifiers }) =>
    <TouchableOpacity
        style={[styles.button, styles.buttonPrimary]}
        onPress={onClick}
    >
        <Text
            style={[styles.buttonText, styles.buttonPrimaryText]}
            accessible={true}
        >
            {value}
        </Text>
    </TouchableOpacity>;

export default Button;

const styles = StyleSheet.create({
    button: {
        marginBottom: 15,
        paddingTop: 16,
        paddingBottom: 16,
        backgroundColor: '#fff',
        borderRadius: 7,
        shadowOpacity: 0.3,
        shadowRadius: 7,
        shadowColor: '#000',
        shadowOffset: { height: 1, width: 0 },
    },
    buttonPrimary: {
        backgroundColor: '#007AFF',
    },
    buttonDisabled: {
        backgroundColor: '#E5E5EA',
    },
    buttonText: {
        fontSize: 18,
        color: '#005C86',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    buttonPrimaryText: {
        color: '#fff',
    },
    buttonTextDisabled: {
        color: '#C7C7CC',
    },
});
