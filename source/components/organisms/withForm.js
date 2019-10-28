import React, { Component } from 'react';
import { Keyboard } from 'react-native';

const withForm = (WrappedComponent, onSubmit) => {
    return class WithForm extends Component {
        state = {
            inputValue: '',
            isFocused: false,
        };

        changeHandler = value => {
            this.setState({inputValue: value});
        }

        componentDidMount() {
            this.keyboardWillShowListener = Keyboard.addListener(
                'keyboardWillShow',
                () => this.setState({ isFocused: true }),
            );
            this.keyboardWillHideListener = Keyboard.addListener(
                'keyboardWillHide',
                () => this.setState({ isFocused: false }),
            );
        }

        componentWillUnmount() {
            this.keyboardWillShowListener.remove();
            this.keyboardWillHideListener.remove();
        }

        submitHandler = (argValue) => {
            const { inputValue } = this.state;
            const value = typeof argValue === 'string' ? argValue : inputValue;

            if (value.length <= 0) {
                return;
            }

            this.setState({ inputValue: '' }, () => {
                if (typeof onSubmit === 'function') {
                    onSubmit(value);
                }
            });
        }

        render() {
            const { submitHandler, changeHandler } = this;
            const instanceMethods = { submitHandler, changeHandler };

            return <WrappedComponent {...instanceMethods} {...this.props} {...this.state} />;
        }
    }
}

export default withForm;
