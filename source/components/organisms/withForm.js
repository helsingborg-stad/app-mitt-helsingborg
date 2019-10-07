import React, { Component } from 'react';

const withForm = (WrappedComponent, onSubmit) => {
    return class WithForm extends Component {
        state = {
            inputValue: ''  
        };
    
        changeHandler = value => {
            this.setState({inputValue: value});
        }
    
        submitHandler = () => {
            const { inputValue } = this.state;
    
            if (inputValue.length <= 0) {
                return;
            }
    
            this.setState({ inputValue: '' }, () => {
                if (typeof onSubmit === 'function') {
                    onSubmit(inputValue);
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