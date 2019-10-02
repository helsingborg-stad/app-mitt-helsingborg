import React, { Component } from 'react';
import PropTypes from 'prop-types'

const withChatForm = (WrappedComponent) => {
    return class WithChatForm extends Component {
        static propTypes = {
            chat: PropTypes.shape({
                addMessages: PropTypes.func.isRequired,
            })
        }

        state = {
            inputValue: ''  
        };
    
        changeHandler = value => {
            this.setState({inputValue: value});
        }
    
        submitHandler = () => {
            const { chat } = this.props;
            const { inputValue } = this.state;
    
            if (inputValue.length <= 0) {
                return;
            }
    
            this.setState({ inputValue: '' }, () => {
                chat.addMessages({
                    Component: ChatBubble,
                    componentProps: {
                        content: inputValue,
                        modifiers: ['human'],
                    }
                });
            });
        }
    
        render() {
            const { submitHandler, changeHandler } = this;
            const instanceMethods = { submitHandler, changeHandler };

            return <WrappedComponent {...instanceMethods} {...this.props} {...this.state} />;
        }
    }
}

export default withChatForm;