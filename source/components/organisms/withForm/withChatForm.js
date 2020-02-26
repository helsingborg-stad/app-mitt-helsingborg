import React, { Component } from 'react';
import PropTypes from 'prop-types';

import withForm from './withForm';

import ChatBubble from '../../atoms/ChatBubble';

const withChatForm = (WrappedComponent, onSubmit) => {
  class WithChatForm extends Component {
    // provides form props to WrappedComponent: submitHandler, changeHandler inputValue
    WrappedComponentWithForm = withForm(WrappedComponent, this.messageOnSubmit);

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

    render() {
      const { WrappedComponentWithForm } = this;
      return <WrappedComponentWithForm {...this.props} />;
    }
  }

  WithChatForm.propTypes = {
    chat: PropTypes.shape({
      addMessages: PropTypes.func.isRequired,
    }),
    onSubmit: PropTypes.func,
  };

  return WithChatForm;
};

export default withChatForm;
