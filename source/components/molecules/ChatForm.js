import React from 'react';
import { TextInput, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ChatSubmitButton } from '../Components';

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
            <ChatSubmitButton submitHandler={props.submitHandler} />
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
});
