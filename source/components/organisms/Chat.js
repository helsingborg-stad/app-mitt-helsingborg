import React, { Component } from 'react'

import ChatMessages from '../molecules/ChatMessages';

import ChatBody from '../atoms/ChatBody';
import ChatWrapper from '../atoms/ChatWrapper';
import ChatFooter from '../atoms/ChatFooter';

import EventHandler, { EVENT_USER_MESSAGE } from '../../helpers/EventHandler';

export default class Chat extends Component {
    state = {
        messages: [],
        ChatUserInput: this.props.ChatUserInput,
        ChatAgent: this.props.ChatAgent
    };

    addMessages = (objects) => {
        const array = Array.isArray(objects) ? objects : [objects];
    
        this.setState((state, props) => {
          let { messages } = state;
          array.forEach(object => { messages.push(object) });
    
          return { messages };
        }, () => {
          const lastMsg = this.state.messages.slice(-1)[0].componentProps;
    
          if (Array.isArray(lastMsg.modifiers) && lastMsg.modifiers[0] === 'user') {
            // console.log(lastMsg.content);
            EventHandler.dispatch(EVENT_USER_MESSAGE, lastMsg.content);
          }

        });
      };

    switchAgent = (AgentComponent) => {
        this.setState({
            ChatAgent: AgentComponent
        });
    }

    switchUserInput = (UserInputComponent) => {
        this.setState({
            ChatUserInput: UserInputComponent
        });
    }

    render() {
        const { messages, ChatAgent, ChatUserInput } = this.state;
        const { addMessages, switchAgent } = this;

        const instanceMethods = { addMessages, switchAgent };

        return (
            <ChatWrapper keyboardVerticalOffset={24} >
                {ChatAgent ?
                    <ChatAgent chat={{...instanceMethods, ...this.state}} /> 
                : null}
                <ChatBody> 
                    <ChatMessages messages={messages} />
                </ChatBody>
                <ChatFooter>
                    {ChatUserInput ?
                        <ChatUserInput chat={{...instanceMethods, ...this.state}} /> 
                    : null}
                </ChatFooter>
            </ChatWrapper>
        )
    }
}
