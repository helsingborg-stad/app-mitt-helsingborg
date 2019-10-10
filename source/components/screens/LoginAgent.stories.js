import React, { Component } from 'react';
import env from 'react-native-config';
import { storiesOf } from '@storybook/react-native';

import EventHandler, { EVENT_USER_MESSAGE } from '../../helpers/EventHandler';

import withChatForm from '../organisms/withChatForm';
import { sendChatMsg } from '../../services/ChatFormService';

import StoryWrapper from '../molecules/StoryWrapper';
import ChatForm from '../molecules/ChatForm';
import ChatMessages from '../molecules/ChatMessages';

import ChatBody from '../atoms/ChatBody';
import ChatWrapper from '../atoms/ChatWrapper';
import ChatFooter from '../atoms/ChatFooter';
import ChatBubble from '../atoms/ChatBubble';
import { Alert } from "react-native";

import Button from '../atoms/Button';
import Text from '../atoms/Text';
import Icon from '../atoms/Icon';

import withAuthentication from '../organisms/withAuthentication';
import { sanitizePin, validatePin } from "../../helpers/ValidationHelper";

class LoginAgent extends Component {
  componentDidMount() {
    const { chat } = this.props;

    chat.addMessages([
      {
        Component: ChatBubble,
        componentProps: {
          content: 'Hej!',
          modifiers: ['automated'],
        }
      },
      {
        Component: ChatBubble,
        componentProps: {
          content: 'Välkommen till Mitt Helsingborg!',
          modifiers: ['automated'],
        }
      },
      {
        Component: ChatBubble,
        componentProps: {
          content: 'Jag heter Sally!',
          modifiers: ['automated'],
        }
      }
    ]);

    EventHandler.subscribe(EVENT_USER_MESSAGE, (message) => this.handleHumanChatMessage(message));

    chat.setInputActions([
      {
        Component: InputAction,
        componentProps: {
          label: 'Jag vill logga in med Mobilt BankID',
          messages: [{
            Component: ChatBubble,
            componentProps: {
              content: 'Logga in',
              modifiers: ['user'],

            }
          }]
        },
      },
      {
        Component: InputAction,
        componentProps: {
          label: 'Jag vill veta mer om Mitt Helsingborg',
          messages: [{
            Component: ChatBubble,
            componentProps: {
              content: 'Berätta mer',
              modifiers: ['user'],

            }
          }]
        },
      },
    ]);
  }

  componentWillUnmount(): void {
    EventHandler.unSubscribe(EVENT_USER_MESSAGE);
  }

  /**
   * Authenticate user
   */
  authenticateUser = async (personalNumber) => {
    const { chat } = this.props;

    if (!personalNumber) {
      Alert.alert('Personnummer saknas');
      return;
    }

    // if (!validatePin(personalNumber)) {
    //   Alert.alert('Felaktigt personnummer. Ange format ÅÅÅÅMMDDXXXX.');
    //   return;
    // }

    try {
      const { loginUser } = this.props.authentication;
      await loginUser(personalNumber);
      chat.switchAgent(FakeAgent);
    } catch (e) {
      if (e.message !== 'cancelled') {
        Alert.alert(e.message);
      }
    }
  };

  /**
 * Sanitize and save personal identity number to state
 * @param {string} personalNumber
 */
  setPin(personalNumber) {
    personalNumber = sanitizePin(personalNumber);

    this.setState({
      personalNumberInput: personalNumber
    });
  }


  // TODO: Implementera Watson för att hantera svaren
  handleHumanChatMessage = (message) => {
    const { chat } = this.props;

    // TODO: Run login logic here
    if (message.search('Logga in') !== -1) {
      //chat.switchAgent(FakeAgent);
      // TODO: Lägg in numpaden
      const ChatFormTest = (props) => {
        return <ChatForm
          {...props}
          autoFocus={true}
          keyboardType='number-pad'
          maxLength={12}
          submitText={'Logga in'}
          placeholder={'Ange ditt personnummer'}
          // TODO: fix input value
          inputValue=''
          changeHandler={(value) => this.setPin(value)}
          submitHandler={() => this.authenticateUser(message)}
        />
      }
      chat.switchUserInput(withChatForm(ChatFormTest));

      //this.authenticateUser('197406027826');

      return;
    }

    if (message.search('Berätta mer') !== -1) {
      chat.addMessages({
        Component: ChatBubble,
        componentProps: {
          content: 'Watson berättar mer',
          modifiers: ['automated'],
        }
      })
      return;
    }

    chat.addMessages({
      Component: ChatBubble,
      componentProps: {
        content: 'Dumb watson response: ' + message,
        modifiers: ['automated'],
      }
    })

  };

  render() {
    return null;
  }
}

InputAction = (props) => {
  return <Button onClick={() => props.addMessages(props.messages)} color={'light'} rounded>
    <Icon name="message" />
    <Text>{props.label}</Text>
  </Button >;
}

class FakeAgent extends Component {
  componentDidMount() {
    const { chat } = this.props;

    chat.addMessages({
      Component: ChatBubble,
      componentProps: {
        content: 'Välkommen!',
        modifiers: ['automated'],
      }
    });

    chat.setInputActions([]);
  }

  render() {
    return null;
  }
}

class ChatScreen extends Component {
  state = {
    messages: [],
    ChatUserInput: withChatForm(ChatForm),
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

      if (lastMsg.modifiers[0] === 'user') {
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
      <StoryWrapper>
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
      </StoryWrapper>
    );
  }
}

storiesOf('Chat', module)
  .add('Login agent', () => (
    <ChatScreen />
  ));
