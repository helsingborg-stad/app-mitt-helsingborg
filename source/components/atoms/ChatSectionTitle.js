import React from 'react';
import { Text, StyleSheet, View } from 'react-native';

const ChatSectionTitle = ({ content }) =>
    <Text style={styles.sectionTitle}>{content}</Text>

export default ChatSectionTitle;

const styles = StyleSheet.create({
    sectionTitle: {
        marginBottom: 16,
        color: '#565656',
        fontSize: 15,
        fontWeight: 'bold',
    },
});
