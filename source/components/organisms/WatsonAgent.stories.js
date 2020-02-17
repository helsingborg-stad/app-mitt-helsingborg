import React, { Component } from 'react';
import env from 'react-native-config';
import { storiesOf } from '@storybook/react-native';
import styled from 'styled-components/native';

import EventHandler, { EVENT_USER_MESSAGE } from '../../helpers/EventHandler';

import withChatForm from './withChatForm';
import Chat from './Chat';

import StoryWrapper from '../molecules/StoryWrapper';
import InputForm from '../molecules/InputForm';

import ParrotAgent from './ParrotAgent';

storiesOf('Chat', module).add('Watson agent', () => (
  <ModifiedStoryWrapper>
    <Chat ChatAgent={ParrotAgent} ChatUserInput={withChatForm(InputForm)} />
  </ModifiedStoryWrapper>
));

const ModifiedStoryWrapper = styled(StoryWrapper)`
  padding-left: 0;
  padding-right: 0;
`;
