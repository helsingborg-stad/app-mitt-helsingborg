import React from 'react';
import { Text, StyleSheet, View } from 'react-native';

const ChatBubble = ({ content, modifiers }) =>
    <View style={[styles.chatBubble, styles[modifiers]]}>
        <Text style={styles.text}>{content}</Text>
    </View >

export default ChatBubble;

const styles = StyleSheet.create({
    chatBubble: {
        marginBottom: 15,
        borderRadius: 12,
        padding: 10,
        backgroundColor: 'gray',
    },
    text: {
        fontSize: 18,
        color: 'white',
    },
    automated: {
        backgroundColor: '#EC6701',
    },
    human: {
        backgroundColor: '#D35098',
    },
    user: {
        backgroundColor: '#0095DB',
    },
});
