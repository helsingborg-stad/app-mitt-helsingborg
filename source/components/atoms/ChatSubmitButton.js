import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const ChatSubmitButton = props => (
  <View style={styles.SubmitButtonWrapper}>
    <TouchableOpacity onPress={props.submitHandler} style={styles.SubmitButtonInner}>
      <Text style={styles.SubmitButtonText}>{props.submitText ? props.submitText : 'Send'}</Text>
    </TouchableOpacity>
  </View>
);

export default ChatSubmitButton;

const styles = StyleSheet.create({
  SubmitButtonWrapper: {
    height: 56,
  },
  SubmitButtonInner: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    padding: 16,
    width: 90,
  },
  SubmitButtonText: {
    color: 'rgb(41, 128, 185)',
    fontWeight: 'bold',
  },
});
