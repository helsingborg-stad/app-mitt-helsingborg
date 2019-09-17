import React from 'react';
import { TextInput, View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const ChatForm = props => {
    return (
        <View style={styles.chatForm}>
            <TextInput
                {...props}
                style={styles.chatTextInput}
                value={props.inputValue}
                onChangeText={props.changeHandler}
                onSubmitEditing={props.submitHandler}
            />
            <SubmitButton submitHandler={props.submitHandler} />
        </View>
    );
}

const SubmitButton = props => {
    return (
        <View style={styles.SubmitButtonWrapper}>
            <TouchableOpacity onPress={props.submitHandler} style={styles.SubmitButtonInner}>
                <Text style={styles.SubmitButtonText}>Send</Text>
            </TouchableOpacity>
        </View>
    );
}

export default ChatForm;

const styles = StyleSheet.create({
    chatForm: {
        flexDirection: 'row',
        borderTopWidth: 0,
        backgroundColor: 'rgb(236, 240, 241)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingLeft: 16
    },
    chatTextInput: {
        flex: 1,
        height: 32,
        padding: 8,
        backgroundColor: 'rgb(236, 240, 241)',
        borderColor: 'rgb(189, 195, 199)',
        borderTopWidth: 0,
        borderRadius: 4
    },
    SubmitButtonWrapper: {
        height: 56,
    },
    SubmitButtonInner: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        padding: 16,
        width: 80
    },
    SubmitButtonText: {
        color: 'rgb(41, 128, 185)',
        fontWeight: 'bold'
    }
});
