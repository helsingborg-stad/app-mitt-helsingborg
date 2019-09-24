import React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { Sally } from '../Components'

const ChatHeader = () =>
    <View style={styles.chatHeader}>
        <Sally />
    </View>

export default ChatHeader;

const styles = StyleSheet.create({
    chatHeader: {
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        height: 60,
        shadowOpacity: 0.3,
        shadowRadius: 3,
        shadowColor: '#000',
        shadowOffset: { height: 0, width: 0 },
    },
});
