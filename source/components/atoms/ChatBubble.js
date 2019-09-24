import React from 'react';
import { Text, StyleSheet, View } from 'react-native';

const ChatBubble = ({ content, modifiers }) =>
    <View style={[styles.chatBubble, styles[modifiers]]}>
        <Text style={styles.text}>{content}</Text>
    </View >

export default ChatBubble;

const styles = StyleSheet.create({
    chatBubble: {
        marginTop: 6,
        marginBottom: 6,
        borderRadius: 17,
        padding: 16,
        backgroundColor: 'gray',
        alignSelf: 'flex-start',
        shadowOpacity: 0.3,
        shadowRadius: 3,
        shadowColor: '#000',
        shadowOffset: { height: 2, width: 0 },
    },
    text: {
        fontSize: 16,
        color: 'white',
    },
    automated: {
        borderBottomLeftRadius: 4,
        backgroundColor: '#EC6701',
    },
    human: {
        borderBottomLeftRadius: 4,
        backgroundColor: '#D35098',
    },
    user: {
        alignSelf: 'flex-end',
        borderBottomRightRadius: 4,
        backgroundColor: '#0095DB',
    },
});
