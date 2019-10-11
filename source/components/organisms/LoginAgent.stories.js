import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, ActivityIndicator } from 'react-native';

import env from 'react-native-config';
import { storiesOf } from '@storybook/react-native';
import styled from 'styled-components/native'

import EventHandler, { EVENT_USER_MESSAGE } from '../../helpers/EventHandler';


import StoryWrapper from '../molecules/StoryWrapper';
import ChatMessages from '../molecules/ChatMessages';

import ChatBody from '../atoms/ChatBody';
import ChatWrapper from '../atoms/ChatWrapper';
import ChatFooter from '../atoms/ChatFooter';

import Button from '../atoms/Button';
import Text from '../atoms/Text';
import Icon from '../atoms/Icon';

import withAuthentication from './withAuthentication';
import { sanitizePin } from "../../helpers/ValidationHelper";


import LoginAgent from './LoginAgent';

// TODO: Replace ChatScreen with general Chat Organism
class ChatScreen extends Component {
  state = {
    messages: [],
    ChatUserInput: false,
    ChatAgent: withAuthentication(LoginAgent),
    inputActions: []
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
    console.log(AgentComponent);
    this.setState({
      ChatAgent: AgentComponent
    });
  };

  switchUserInput = (UserInputComponent) => {
    this.setState({
      ChatUserInput: UserInputComponent
    });
  };

  // TODO: Implement setInputActions functionality outside of Chat organism
  setInputActions = (inputActions) => {
    this.setState({
      inputActions
    });
  }

  render() {
    const { messages, ChatAgent, ChatUserInput } = this.state;
    const { addMessages, switchAgent, switchUserInput, setInputActions } = this;

    const instanceMethods = { addMessages, switchAgent, switchUserInput, setInputActions };

    return (
      <ModifiedStoryWrapper>
        <ChatWrapper keyboardVerticalOffset={24} >
          {ChatAgent ?
            <ChatAgent chat={{ ...instanceMethods, ...this.state }} />
            : null}
          <ChatBody>
            <ChatMessages messages={messages} />
          </ChatBody>
          <ChatFooter>
            {ChatUserInput ?
              <ChatUserInput chat={{ ...instanceMethods, ...this.state }} />
              : null}
          </ChatFooter>
        </ChatWrapper>
      </ModifiedStoryWrapper>
    );
  }
}


const ModifiedStoryWrapper = styled(StoryWrapper)`
  padding-left: 0;
  padding-right: 0;
`;

storiesOf('Chat', module)
  .add('Login agent', () => (
    <ChatScreen />
  ));