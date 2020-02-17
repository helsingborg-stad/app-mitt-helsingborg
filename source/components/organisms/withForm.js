import React, { Component } from 'react';
import { Keyboard, Alert } from 'react-native';

const withForm = (WrappedComponent, onSubmit) =>
  class WithForm extends Component {
    state = {
      inputValue: '',
      isFocused: false,
    };

    static defaultProps = {
      withForm: {},
    };

    changeHandler = value => {
      const { withForm } = this.props;
      const { filterChangeHandler } = withForm;

      this.setState({
        inputValue: typeof filterChangeHandler === 'function' ? filterChangeHandler(value) : value,
      });
    };

    componentDidMount() {
      this.keyboardWillShowListener = Keyboard.addListener('keyboardWillShow', () =>
        this.setState({ isFocused: true })
      );
      this.keyboardWillHideListener = Keyboard.addListener('keyboardWillHide', () =>
        this.setState({ isFocused: false })
      );
    }

    componentWillUnmount() {
      this.keyboardWillShowListener.remove();
      this.keyboardWillHideListener.remove();
    }

    submitHandler = argValue => {
      const { withForm } = this.props;
      const { inputValue } = this.state;
      const value = typeof argValue === 'string' ? argValue : inputValue;

      const { validateSubmitHandlerInput } = withForm;

      if (value.length <= 0) {
        return;
      }

      // Validation callback should return object with keys: isValid (Boolean) and message (String)
      if (typeof validateSubmitHandlerInput === 'function') {
        const { isValid, message } = validateSubmitHandlerInput(value);

        if (!isValid) {
          Alert.alert(message);
          return;
        }
      }

      this.setState({ inputValue: '' }, () => {
        if (typeof onSubmit === 'function') {
          onSubmit(value);
        }
      });
    };

    render() {
      const { submitHandler, changeHandler } = this;
      const instanceMethods = { submitHandler, changeHandler };

      return <WrappedComponent {...instanceMethods} {...this.props} {...this.state} />;
    }
  };

export default withForm;
