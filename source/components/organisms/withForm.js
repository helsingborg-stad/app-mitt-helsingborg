import React, { Component } from 'react';

const withForm = (WrappedComponent, onSubmit) => {
    return class WithForm extends Component {
        state = {
            inputValue: ''  
        };
    
        changeHandler = value => {
            this.setState({inputValue: value});
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