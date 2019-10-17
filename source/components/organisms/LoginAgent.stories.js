import React, { Component } from 'react';
import { storiesOf } from '@storybook/react-native';
import styled from 'styled-components/native'

import StoryWrapper from '../molecules/StoryWrapper';

import withAuthentication from './withAuthentication';
import LoginAgent from './LoginAgent';
import Chat from './Chat';

const ModifiedStoryWrapper = styled(StoryWrapper)`
  padding-left: 0;
  padding-right: 0;
`;

storiesOf('Chat', module)
  .add('Login agent', () => (
    <ModifiedStoryWrapper>
      <Chat ChatAgent={LoginAgent}  />
    </ModifiedStoryWrapper>
  ));