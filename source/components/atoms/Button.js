import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const Button = ({ value, onClick, modifiers }) =>
    <TouchableOpacity
        style={[styles.button, styles.buttonPrimary, styles.buttonAlignRight]}
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
        padding: 16,
        backgroundColor: '#fff',
        borderRadius: 17,
        shadowOpacity: 0.3,
        shadowRadius: 3,
        shadowColor: '#000',
        shadowOffset: { height: 2, width: 0 },
    },
    buttonAlignRight: {
        alignSelf: 'flex-end',
    },
    buttonPrimary: {
        backgroundColor: '#0095DB',
    },
    buttonDisabled: {
        backgroundColor: '#E5E5EA',
    },
    buttonText: {
        fontSize: 18,
        color: '#005C86',
        textAlign: 'left',
        fontWeight: 'bold',
    },
    buttonPrimaryText: {
        color: '#fff',
    },
    buttonTextDisabled: {
        color: '#C7C7CC',
    },
});
