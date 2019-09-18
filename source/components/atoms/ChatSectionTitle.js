import React from 'react';
import { Text, StyleSheet, View } from 'react-native';

const ChatSectionTitle = ({ content }) =>
    <View style={styles.sectionTitleWrapper}>
        <Text style={styles.sectionTitle}>{content}</Text>
    </View>;


export default ChatSectionTitle;

const styles = StyleSheet.create({
    sectionTitleWrapper: {
        borderStyle: 'dotted', // Does not work in React Native
        borderBottomColor: '#565656',
        borderBottomWidth: 1,
        paddingBottom: 8,
        marginBottom: 16,
    },
    sectionTitle: {
        color: '#565656',
        fontSize: 15,
        fontWeight: 'bold',
    },
});
