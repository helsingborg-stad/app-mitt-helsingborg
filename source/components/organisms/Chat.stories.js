import React, { Component } from 'react';
import { storiesOf } from '@storybook/react-native';

import Chat from './Chat';
import ExampleAgent from './ExampleAgent';
import withChatForm from './withChatForm';

import StoryWrapper from '../molecules/StoryWrapper';
import ChatForm from '../molecules/ChatForm';

storiesOf('Chat', module)
    .add('Example with agents', () => (
        <StoryWrapper>
            <Chat ChatAgent={ExampleAgent} ChatUserInput={withChatForm(ChatForm)} />       
        </StoryWrapper>
    ));