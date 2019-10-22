import React, { Component } from 'react';

import withChatForm from './withChatForm';
import ChatForm from '../molecules/ChatFormDeprecated';
import Input from '../atoms/Input';

const TestInput = props => {
       return (
        <Input
            {...props}
            value={props.inputValue}
            onChangeText={props.changeHandler}
            onSubmitEditing={props.submitHandler}
        />
    );
};

const withChatController = (WrappedComponent, onSubmit) => {
    return class WithChatController extends Component {
        
        switchInput = (inputArr) => {
            const { chat } = this.props;
            const inputArray = !Array.isArray(inputArr) ? [inputArr] : inputArr;

            chat.switchUserInput(withChatForm(props => (
                <ChatForm {...props}>
                    {
                        inputArray
                        .map(this.mapInputComponent)
                        .map(({Component, ComponentProps}, index) => (
                            Component
                            ? <Component {...ComponentProps} {...props} key={`${Component}-${index}`}/>
                            : null
                        ))
                    }
                </ChatForm>             
            )));
        }

        mapInputComponent = (input, index) => {
            const { filterPropetiesByKeys } = this;

            let inputComponent = {
                Component: false,
                ComponentProps: false
            };

            switch(input.type) {
                case 'text':
                    inputComponent = {
                       Component: TestInput, 
                       ComponentProps: {
                           ...filterPropetiesByKeys(input, ['placeholder', 'autoFocus', 'maxLength', 'submitText'])
                       }
                    };
                    break;

                case 'number':
                    inputComponent =  {
                        Component: TestInput, 
                        ComponentProps: {
                            ...filterPropetiesByKeys(input, ['placeholder', 'autoFocus', 'maxLength', 'submitText']), 
                            keyboardType: 'numeric',
                            autoFocus: true
                        }
                    };
                    break;
                    
                case 'radio':

                    // const radioComponent =  {
                    //     Component: ButtonGroup, 
                    //     ComponentProps: {
                    //         ...filterPropetiesByKeys(input, ['placeholder', 'autoFocus', 'maxLength', 'submitText']), 
                    //         keyboardType: 'numeric',
                    //         autoFocus: true
                    //     }
                    // };
                    // return null;

                    // return {
                    //     Component: OptionButtons,
                    //     ComponentProps: {
                    //         items: {

                    //         }
                    //     }
                    // };
                    // chat.switchUserInput(props => (<ChatForm {...props} hideUserInput />));
                    // chat.setInputActions(input.options.map(option => (
                    //     {
                    //         Component: InputAction,
                    //         componentProps: {
                    //             label: option.value,
                    //             messages: [{
                    //             Component: ChatBubble,
                    //             componentProps: {
                    //                 content: option.value,
                    //                 modifiers: ['user'],
                    //             }
                    //             }]
                    //         },
                    //     }
                    // )));
    
                    break;
                case 'select':
                    //     return null;
                    // Object.entries(input).forEach(propety => {
                    //     const [key, value] = propety;
                    //     if (allowedInputOptions.select.includes(key)) {
                    //         options[key] = value;
                    //     }
                    // });
                    // chat.switchUserInput(withChatForm((props) => (
                    //     <ChatForm {...props}>
                    //         <Select 
                    //             {...props} 
                    //             onValueChange={props.changeHandler}
                    //             items={input.options.map(option => ({label: option.value, value: option.value}))}
                    //             {...options}
                                
                    //         />
                    //     </ChatForm>
                     
                    // )));
                    break;
                case 'dateTime':
                    // null
                    break;
                default:
                  // code block
              }
              return inputComponent;
        }

        filterPropetiesByKeys = (object = {}, keys = []) => (
            Object.entries(object)
            .reduce((accumulator, [itemKey, itemValue]) => {
                let optionsObject = accumulator;
                if (keys.includes(itemKey)) {
                    optionsObject[itemKey] = itemValue;
                }

                return optionsObject;
            }, {})
        );

        render() {
            const { switchInput } = this;
            const instanceMethods = {};

            return <WrappedComponent {...instanceMethods} {...this.props} {...this.state} chat={{...this.props.chat, switchInput}}  />;
        }
    }
}

export default withChatController;