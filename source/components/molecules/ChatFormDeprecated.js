import React from 'react';
import { TextInput, View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import styled from 'styled-components/native';
import ChatSubmitButton from '../atoms/ChatSubmitButton';
import Input from '../atoms/Input';
import Button from '../atoms/Button';
import Icon from '../atoms/Icon';

const ChatFormDeprecated = props => {
  renderItem = ({ item, index }) => {
    const { Component, componentProps } = item;
    return (
      <ActionItemWrapper>
        <Component {...componentProps} addMessages={props.chat.addMessages} />
      </ActionItemWrapper>
    );
  };

  /** Override child components */
  const children =
    props.children && props.children.length > 0
      ? React.Children.map(props.children, (child, index) =>
          child && child.type
            ? React.createElement(child.type, { ...child.props, ...props })
            : child
        )
      : false;

  return (
    <ChatUserInputWrapper>
      {!props.hideUserInput ? (
        <ChatFormWrapper>
          {children ? (
            children
          ) : (
            <Input
              value={props.inputValue}
              onChangeText={props.changeHandler}
              onSubmitEditing={props.submitHandler}
              placeholder="Skriv något... "
              keyboardType="default"
              {...props}
            />
          )}

          <Button onClick={props.submitHandler} z={0}>
            {props.submitText ? <Text>{props.submitText}</Text> : <Icon name="send" />}
          </Button>
        </ChatFormWrapper>
      ) : null}

      {!children && props.chat && props.chat.inputActions && (
        <View>
          <FlatList
            scrollEnabled={false}
            data={props.chat.inputActions}
            renderItem={(item, index) => this.renderItem(item, index)}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>}
    </ChatUserInputWrapper>
  );
};

const ChatFormWrapper = styled.View`
  margin-top: 12px;
  margin-bottom: 6px;
  margin-left: 16px;
  margin-right: 16px;
  flex-direction: row;
`;

const ActionItemWrapper = styled.View`
  margin-left: 16px;
  margin-right: 16px;
  margin-top: 6px;
  margin-bottom: 6px;
`;

const ChatUserInputWrapper = styled.View`
  background-color: ${props => props.theme.chatForm.background};
  overflow: visible;
  border-top-width: 1px;
  border-color: ${props => props.theme.border.default};
  margin-top 16px;
  padding-bottom: 8px;
`;

export default ChatFormDeprecated;
