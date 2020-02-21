/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { withTheme } from 'styled-components/native';
import { excludePropetiesWithKey, includePropetiesWithKey } from '../../helpers/Objects';
import Input from '../atoms/Input';
import ChatForm from './ChatForm';

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
