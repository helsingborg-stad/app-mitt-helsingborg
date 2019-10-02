import React, { Component } from 'react';
import { storiesOf } from '@storybook/react-native';

import withChatForm from '../organisms/withChatForm';

import StoryWrapper from '../molecules/StoryWrapper';
import ChatForm from '../molecules/ChatForm';
import ChatMessages from '../molecules/ChatMessages';

import ChatBody from '../atoms/ChatBody';
import ChatWrapper from '../atoms/ChatWrapper';
import ChatFooter from '../atoms/ChatFooter';
import ChatBubble from '../atoms/ChatBubble';


let COUNTER = 0;

class ExampleAgent extends Component {
    componentDidMount() {
        const { chat } = this.props;

        chat.addMessages({
            Component: ChatBubble,
            componentProps: {
                content: 'Hello from agent 1',
                modifiers: ['automated'],
            }
        });

        setTimeout(() => {
            COUNTER++;
            chat.switchAgent(ExampleAgentTwo);
        }, 1000);
    }

    render() {
        return null;
    }
}

class ExampleAgentTwo extends Component {
    componentDidMount() {
        const { chat } = this.props;

        if (COUNTER > 50) {
            return;
        }

        chat.addMessages({
            Component: ChatBubble,
            componentProps: {
                content: 'Hello from agent 2!',
                modifiers: ['automated'],
            }
        });

        setTimeout(() => {
            COUNTER++;
            chat.switchAgent(ExampleAgent);
        }, 1000);
    }

    render() {
        return null;
    }
}

class ChatScreen extends Component {
    state = {
        messages: [],
        ChatUserInput: withChatForm(ChatForm),
        ChatAgent: ExampleAgent
    };

    addMessages = (objects) => {
        const array = Array.isArray(objects) ? objects : [objects];

        this.setState((state, props) => {
            let { messages } = state;
            array.forEach(object => { messages.push(object) });

            return {messages};
        });
    }

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
            <StoryWrapper>
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
            </StoryWrapper>
        );
    }
}

storiesOf('Chat', module)
    .add('default', () => (
        <ChatScreen />
    ));