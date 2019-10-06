import React, { Component } from 'react';
import { storiesOf } from '@storybook/react-native';

import EventHandler, { EVENT_USER_MESSAGE } from '../../helpers/EventHandler';

import withChatForm from '../organisms/withChatForm';

import StoryWrapper from '../molecules/StoryWrapper';
import ChatForm from '../molecules/ChatForm';
import ChatMessages from '../molecules/ChatMessages';

import ChatBody from '../atoms/ChatBody';
import ChatWrapper from '../atoms/ChatWrapper';
import ChatFooter from '../atoms/ChatFooter';
import ChatBubble from '../atoms/ChatBubble';

class WatsonAgent extends Component {
    componentDidMount() {
        const { chat } = this.props;

        chat.addMessages({
            Component: ChatBubble,
            componentProps: {
                content: 'Hello from Watson.',
                modifiers: ['automated'],
            }
        });

        EventHandler.subscribe(EVENT_USER_MESSAGE, (message) => this.handleHumanChatMessage(message));
    }

    componentWillUnmount(): void {
        EventHandler.unSubscribe(EVENT_USER_MESSAGE);
    }

    handleHumanChatMessage = (message) => {
        console.log('from watson: ',message);

    };

    render() {
        return null;
    }
}

class ParrotAgent extends Component {
    componentDidMount() {
        const { chat } = this.props;

        chat.addMessages({
            Component: ChatBubble,
            componentProps: {
                content: 'Do not say Watson!',
                modifiers: ['automated'],
            }
        });

        EventHandler.subscribe(EVENT_USER_MESSAGE, (message) => this.handleHumanChatMessage(message));
    }

    componentWillUnmount(): void {
        EventHandler.unSubscribe(EVENT_USER_MESSAGE);
    }

    handleHumanChatMessage = (message) => {
        const { chat } = this.props;

        if (message.search('Watson') !== -1) {
            chat.switchAgent(WatsonAgent);

            message = 'Switching to agent Watson.';
        }

        chat.addMessages({
            Component: ChatBubble,
            componentProps: {
                content: 'Parrot: ' + message,
                modifiers: ['automated'],
            }
        })
    };

    render() {
        return null;
    }
}

class ChatScreen extends Component {
    state = {
        messages: [],
        ChatUserInput: withChatForm(ChatForm),
        ChatAgent: ParrotAgent,
    };

    addMessages = (objects) => {
        const array = Array.isArray(objects) ? objects : [objects];

        this.setState((state, props) => {
            let { messages } = state;
            array.forEach(object => { messages.push(object) });

            return {messages};
        }, () => {
            const lastMsg = this.state.messages.slice(-1)[0].componentProps;

            if (lastMsg.modifiers[0] === 'human') {
                // console.log(lastMsg.content);
                EventHandler.dispatch(EVENT_USER_MESSAGE, lastMsg.content);
            }

        });
    };

    switchAgent = (AgentComponent) => {
        this.setState({
            ChatAgent: AgentComponent
        });
    };

    switchUserInput = (UserInputComponent) => {
        this.setState({
            ChatUserInput: UserInputComponent
        });
    };

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
    .add('Watson agent', () => (
        <ChatScreen />
    ));
