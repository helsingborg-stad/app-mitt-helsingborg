import React, { Component } from 'react';
import { View } from 'react-native';

import { filterPropetiesByKeys } from '../../helpers/Objects';

import withChatForm from './withChatForm';
import ChatFormDeprecated from '../molecules/ChatFormDeprecated';
import ChatForm from '../molecules/ChatForm';
import Input from '../atoms/Input';
import styled from 'styled-components/native';

import ButtonStack from '../molecules/ButtonStack';

import Heading from '../atoms/Heading';
import Button from '../atoms/Button';
import Text from '../atoms/Text';
import Icon from '../atoms/Icon';


import ChatBubble from '../atoms/ChatBubble';

const ChatUserInputWrapper = styled.View`
  background-color: ${props => props.theme.chatForm.background};
  overflow: visible;
  border-top-width: 1px;
  border-color: ${props => props.theme.border.default};
  margin-top 16px;
  padding-bottom: 8px;
`;

const withChatController = (WrappedComponent, onSubmit) => {
    return class WithChatController extends Component {
        
        switchInput = (inputArr) => {
            const { chat } = this.props;
            const inputArray = !Array.isArray(inputArr) ? [inputArr] : inputArr;

            chat.switchUserInput(withChatForm(props => (
                <ChatUserInputWrapper>
                    {
                        inputArray
                        .map(this.mapInputComponent)
                        .map(({Component, ComponentProps}, index) => (
                            Component
                            ? <Component {...ComponentProps} {...props} key={`${Component}-${index}`}/>
                            : null
                        ))
                    }
                </ChatUserInputWrapper>             
            )));
        }

        mapInputComponent = (input, index) => {
            let inputComponent = {
                Component: false,
                ComponentProps: false
            };

            switch(input.type) {
                case 'text':
                    inputComponent = {
                       Component: InputForm, 
                       ComponentProps: {
                           ...filterPropetiesByKeys(input, ['placeholder', 'autoFocus', 'maxLength', 'submitText'])
                       }
                    };
                    break;

                case 'number':
                    inputComponent =  {
                        Component: InputForm, 
                        ComponentProps: {
                            ...filterPropetiesByKeys(input, ['placeholder', 'autoFocus', 'maxLength', 'submitText']), 
                            keyboardType: 'numeric',
                            autoFocus: true
                        }
                    };
                    break;
                    
                case 'radio':
                    inputComponent =  {
                        Component: ButtonStack, 
                        ComponentProps: {
                            items: input.options.map(option => (
                                {
                                    Component: ActionButton,
                                    componentProps: {
                                        label: option.value,
                                        messages: [{
                                        Component: ChatBubble,
                                        componentProps: {
                                            content: option.value,
                                            modifiers: ['user'],
                                        }
                                        }]
                                    },
                                }
                            ))
                        }
                    };
    
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

        render() {
            const { switchInput } = this;
            const instanceMethods = {};

            return <WrappedComponent {...instanceMethods} {...this.props} {...this.state} chat={{...this.props.chat, switchInput}}  />;
        }
    }
}

export default withChatController;


const ActionButton = (props) => {
    return (
        <Button onClick={() => props.addMessages(props.messages)} color={'light'} rounded>
            <Icon name="message" />
            <Text>{props.label}</Text>
        </Button>
    );
  }
  

const InputForm = props => {
    return (
        <ChatForm {...filterPropetiesByKeys(props, ['submitHandler', 'changeHandler', 'inputValue'])}>
            <Input {...props} />
        </ChatForm>
    );
};