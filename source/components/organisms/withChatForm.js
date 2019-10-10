import React, { Component } from 'react';
import PropTypes from 'prop-types'

import withForm from './withForm';

import ChatBubble from '../atoms/ChatBubble';

const withChatForm = (WrappedComponent, options = {}) => {
    return class WithChatForm extends Component {
        static propTypes = {
            chat: PropTypes.shape({
                addMessages: PropTypes.func.isRequired,
            }),
            onSubmit: PropTypes.func
        }

        onSubmit = (inputValue) => {
            const { chat } = this.props;
            const { onSubmit } = options;

            if (typeof onSubmit === 'function') {
                onSubmit(inputValue);
                return;
            }

            chat.addMessages({
                Component: ChatBubble,
                componentProps: {
                    content: inputValue,
                    modifiers: ['user'],
                }
            });    
        }

        render() {
            const { onSubmit } = this;

            const WrappedComponentWithForm = withForm(WrappedComponent, onSubmit);

            return <WrappedComponentWithForm {...this.props} />;
        }
    }
}

export default withChatForm;
