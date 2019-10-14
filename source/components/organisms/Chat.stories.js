import React, { Component } from 'react';
import { storiesOf } from '@storybook/react-native';

import Chat from './Chat';
import withChatForm from './withChatForm';

import StoryWrapper from '../molecules/StoryWrapper';
import ChatForm from '../molecules/ChatForm';

import FormAgent from './FormAgent/FormAgent';
import WatsonAgent from './WatsonAgent/WatsonAgent';

storiesOf('Chat', module)
    .add('Example with agents', () => (
        <StoryWrapper>
             <Chat defaultAgent="WatsonAgent" agentList={[WatsonAgent, FormAgent]} userInput={withChatForm(ChatForm)} />              
        </StoryWrapper>
    ));