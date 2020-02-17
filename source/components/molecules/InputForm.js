/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { Keyboard, TextInput, View, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import styled, { withTheme } from 'styled-components/native';
import { includePropetiesWithKey, excludePropetiesWithKey } from '../../helpers/Objects';
import ChatForm from './ChatForm';
import Input from '../atoms/Input';

const InputForm = props => {
  const chatFormProps = ['isFocused', 'submitHandler', 'changeHandler', 'inputValue', 'submitText'];
  return (
    <ChatForm {...includePropetiesWithKey(props, chatFormProps)}>
      <Input
        placeholderTextColor={props.theme.input.placeholder}
        {...excludePropetiesWithKey(props, chatFormProps)}
      />
    </ChatForm>
  );
};

export default withTheme(InputForm);
