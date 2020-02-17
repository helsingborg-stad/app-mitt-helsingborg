import React, { Component } from 'react';
import { Text, View } from 'react-native';
import styled from 'styled-components/native';

import { excludePropetiesWithKey, includePropetiesWithKey } from '../../helpers/Objects';

import withChatForm from '../organisms/withChatForm';

import ButtonStack from './ButtonStack';
import DateTimePickerForm from './DateTimePickerForm';
import InputForm from './InputForm';

export default class ChatUserInput extends Component {
  avalibleComponents = {
    text: withChatForm(InputForm),
    number: withChatForm(InputForm),
    radio: ButtonStack,
    select: {},
    dateTime: withChatForm(DateTimePickerForm),
    custom: {},
  };

  componentController = (input, index) => {
    let data = {
      Component: false,
      componentProps: {},
    };

    switch (input.type) {
      case 'text':
        data = {
          Component: this.avalibleComponents.text,
          componentProps: {
            blurOnSubmit: false,
            autoFocus: true,
            ...includePropetiesWithKey(input, [
              'placeholder',
              'autoFocus',
              'maxLength',
              'submitText',
              'withForm',
            ]),
          },
        };
        break;

      case 'number':
        data = {
          Component: this.avalibleComponents.number,
          componentProps: {
            blurOnSubmit: false,
            autoFocus: true,
            keyboardType: 'numeric',
            ...includePropetiesWithKey(input, [
              'placeholder',
              'autoFocus',
              'maxLength',
              'submitText',
              'withForm',
            ]),
          },
        };
        break;

      case 'radio':
        data = {
          Component: this.avalibleComponents.radio,
          componentProps: {
            items: input.options,
          },
        };
        break;

      case 'select':
        // SelectForm
        break;

      case 'datetime':
        data = {
          Component: this.avalibleComponents.dateTime,
          componentProps: {
            mode: 'datetime',
            ...includePropetiesWithKey(input, ['placeholder', 'selectorProps']),
          },
        };
        break;

      case 'date':
        data = {
          Component: this.avalibleComponents.dateTime,
          componentProps: {
            mode: 'date',
            ...includePropetiesWithKey(input, ['placeholder', 'selectorProps']),
          },
        };
        break;

      case 'time':
        data = {
          Component: this.avalibleComponents.dateTime,
          componentProps: {
            mode: 'time',
            ...includePropetiesWithKey(input, ['placeholder', 'selectorProps']),
          },
        };
        break;

      case 'custom':
        data = {
          Component: input.Component,
          componentProps: {
            ...includePropetiesWithKey(input, ['componentProps']),
          },
        };
        break;

      default:
      // code block
    }

    return data;
  };

  render() {
    const { inputArray, chat } = this.props;

    return (
      <ChatUserInputWrapper>
        {inputArray

          // Component data
          .map(this.componentController)

          // render JSX element
          .map(({ Component, componentProps }, index) =>
            Component ? (
              <Component
                chat={excludePropetiesWithKey(chat, ['messages'])}
                key={`${Component}-${index}`}
                {...componentProps}
              />
            ) : null
          )}
      </ChatUserInputWrapper>
    );
  }
}

const ChatUserInputWrapper = styled.View`
  background-color: ${props => props.theme.chatForm.background};
  overflow: visible;
  border-top-width: 1px;
  border-color: ${props => props.theme.border.default};
  margin-top 16px;
  padding-bottom: 6px;
`;
