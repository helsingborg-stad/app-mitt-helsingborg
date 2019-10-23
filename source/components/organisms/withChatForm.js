import React, { Component } from 'react';
import PropTypes from 'prop-types'

import withForm from './withForm';

import ChatBubble from '../atoms/ChatBubble';

const withChatForm = (WrappedComponent, onSubmit) => {
    return class WithChatForm extends Component {
        static propTypes = {
            chat: PropTypes.shape({
                addMessages: PropTypes.func.isRequired,
            }),
            onSubmit: PropTypes.func
        }

        messageOnSubmit = (inputValue) => {
            const { chat } = this.props;

            chat.addMessages({
                Component: ChatBubble,
                componentProps: {
                    content: inputValue,
                    modifiers: ['user'],
                }
            }); 
            
            if (typeof onSubmit === 'function') {
                onSubmit(inputValue);
            }
        }

        render() {
            const { messageOnSubmit } = this;

            // provides form props to WrappedComponent: submitHandler, changeHandler inputValue
            const WrappedComponentWithForm = withForm(WrappedComponent, messageOnSubmit);

            return <WrappedComponentWithForm {...this.props} />;
        }
    }
}

export default withChatForm;
