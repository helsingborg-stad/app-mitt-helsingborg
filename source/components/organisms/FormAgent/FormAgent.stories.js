import React, { Component } from 'react';
import { storiesOf } from '@storybook/react-native';

import StoryWrapper from '../../molecules/StoryWrapper';

import Chat from '../Chat';

import WatsonAgent from '../WatsonAgent/WatsonAgent';
import FormAgent from './';
import withChatForm from '../withChatForm';
import ChatForm from '../../molecules/ChatFormDeprecated';
import StorageService from '../../../services/StorageService';
import { getFormTemplate } from '../../../services/ChatFormService';


const FAKE_TOKEN = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImp0aSI6IjFlZDcyYzJjLWQ5OGUtNGZjMC04ZGY2LWY5NjRkOTYxMTVjYSIsImlhdCI6MTU2Mjc0NzM2NiwiZXhwIjoxNTYyNzUwOTc0fQ.iwmUMm51j-j2BYui9v9371DkY5LwLGATWn4LepVxmNk'

const TestFormAgent = () => {

    const agents = [
        WatsonAgent,
        FormAgent,
    ] 
    
    return (
        <StoryWrapper>
            <Chat defaultAgent="WatsonAgent" agentList={agents} userInput={withChatForm(ChatForm)} />
        </StoryWrapper>
    )
}

storiesOf('Chat', module)
    .add('Form agent', () => (
        <TestFormAgent />
    ));
