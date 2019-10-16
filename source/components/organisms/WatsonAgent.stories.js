import React, { Component } from 'react';
import { storiesOf } from '@storybook/react-native';
import styled from 'styled-components/native'
import EventHandler, { EVENT_USER_MESSAGE } from '../../helpers/EventHandler';

import withChatForm from './withChatForm';

import StoryWrapper from '../molecules/StoryWrapper';
import ChatForm from '../molecules/ChatForm';
import ChatBubble from '../atoms/ChatBubble';

import Chat from './Chat';

import WatsonAgent from './WatsonAgent';

class ParrotAgent extends Component {
    componentDidMount() {
        const { chat } = this.props;

        chat.addMessages({
            Component: ChatBubble,
            componentProps: {
                content: 'Skriv Watson för att byta agent.',
                modifiers: ['automated'],
            }
        });

        EventHandler.subscribe(EVENT_USER_MESSAGE, (message) => this.handleHumanChatMessage(message));
    }

    componentWillUnmount() {
        EventHandler.unSubscribe(EVENT_USER_MESSAGE);
    }

    handleHumanChatMessage = (message) => {
        const { chat } = this.props;

        if (message.search('Watson') !== -1) {
            chat.switchAgent(WatsonAgent);

            message = 'Byter till agent Watson.';
        }

        chat.addMessages({
            Component: ChatBubble,
            componentProps: {
                content: 'Papegoja säger: ' + message,
                modifiers: ['automated'],
            }
        })
    };

    render() {
        return null;
    }
}

const ModifiedStoryWrapper = styled(StoryWrapper)`
  padding-left: 0;
  padding-right: 0;
`;

storiesOf('Chat', module)
    .add('Watson agent', () => (
        <ModifiedStoryWrapper>
            <Chat ChatAgent={ParrotAgent} ChatUserInput={withChatForm(ChatForm)}  />
        </ModifiedStoryWrapper>
    ));
