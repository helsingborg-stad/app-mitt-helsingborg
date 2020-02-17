/* eslint-disable react/sort-comp */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/static-property-placement */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import withForm from './withForm';

import ChatBubble from '../atoms/ChatBubble';

const withChatForm = (WrappedComponent, onSubmit) =>
  class WithChatForm extends Component {
    static propTypes = {
      chat: PropTypes.shape({
        addMessages: PropTypes.func.isRequired,
      }),
      onSubmit: PropTypes.func,
    };

    messageOnSubmit = inputValue => {
      const { chat } = this.props;

      chat.addMessages({
        Component: ChatBubble,
        componentProps: {
          content: inputValue,
          modifiers: ['user'],
        },
      });

      if (typeof onSubmit === 'function') {
        onSubmit(inputValue);
      }
    };

    // provides form props to WrappedComponent: submitHandler, changeHandler inputValue
    WrappedComponentWithForm = withForm(WrappedComponent, this.messageOnSubmit);

    render() {
      const { WrappedComponentWithForm } = this;
      return <WrappedComponentWithForm {...this.props} />;
    }
  };

export default withChatForm;
