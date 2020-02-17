import React from 'react';
import { Text, StyleSheet, View } from 'react-native';

const ChatSectionTitle = ({ content }) => (
  <View style={styles.sectionTitleWrapper}>
    <Text style={styles.sectionTitle}>{content}</Text>
  </View>
);

export default ChatSectionTitle;

const styles = StyleSheet.create({
  sectionTitleWrapper: {
    borderBottomColor: 'gainsboro',
    borderBottomWidth: 1,
    paddingBottom: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    color: '#565656',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
