import React from 'react';
import { TextInput, View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import ChatSubmitButton from '../atoms/ChatSubmitButton';

const ChatForm = props => {

  renderItem = ({ item, index }) => {
    const { Component, componentProps } = item;
    return <Component {...componentProps} addMessages={props.chat.addMessages} />;
  }

  return (
    <View>
      <View style={styles.chatForm}>
        <TextInput
          {...props}
          style={styles.chatTextInput}
          value={props.inputValue}
          onChangeText={props.changeHandler}
          onSubmitEditing={props.submitHandler}
        />
        <ChatSubmitButton submitHandler={props.submitHandler} submitText={props.submitText} />
      </View>
      {props.chat.inputActions &&
        <View>
          <FlatList
            scrollEnabled={false}
            data={props.chat.inputActions} renderItem={(item, index) => this.renderItem(item, index)}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      }
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
