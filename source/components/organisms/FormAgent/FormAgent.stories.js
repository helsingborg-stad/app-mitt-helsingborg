import React, { Component } from 'react';
import { storiesOf } from '@storybook/react-native';

import StoryWrapper from '../../molecules/StoryWrapper';

import Chat from '../Chat';
import FormAgent from './';


storiesOf('Chat', module)
    .add('Form agent', () => (
        <StoryWrapper>
            <Chat ChatAgent={props => (<FormAgent {...props} formId={1} />)} />
        </StoryWrapper>
    ));
