import React, { Component } from 'react';
import env from 'react-native-config';
import { storiesOf } from '@storybook/react-native';
import { StyleSheet, View, TouchableOpacity, ActivityIndicator } from 'react-native';

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


import WatsonAgent from '../organisms/WatsonAgent';

const BankIdLoading = props => (  
<View style={styles.container}>
  <View style={styles.content}>
      <ActivityIndicator size="large" color="slategray" />
      {!props.isBankidInstalled &&
          <Text style={styles.infoText}>Väntar på att BankID ska startas på en annan enhet</Text>
      }
  </View>
  <View style={styles.loginContainer}>
      <TouchableOpacity
          style={styles.button}
          onPress={props.cancelLogin}
          underlayColor='#fff'>
          <Text style={styles.buttonText}>Avbryt</Text>
      </TouchableOpacity>
  </View>
</View>);

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
    this.showInitialUserInput();
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

    if (!validatePin(personalNumber)) {
      Alert.alert('Felaktigt personnummer. Ange format ÅÅÅÅMMDDXXXX.');
      return;
    }

    chat.switchUserInput(() => (<BankIdLoading {...this.props.authentication } cancelLogin={() => {
      this.props.authentication.cancelLogin();
      this.showInitialUserInput();
    }} />));

    try {
      const { loginUser } = this.props.authentication;
      await loginUser(personalNumber);
      chat.switchAgent(WatsonAgent);
      chat.switchUserInput(withChatForm(ChatForm));
      chat.setInputActions([]);
    } catch (e) {
      if (e.message !== 'cancelled') {
        Alert.alert(e.message);
      }
    }
  };

  showInitialUserInput = () => {
    const { chat } = this.props;
    chat.switchUserInput(withChatForm(ChatForm));
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

  showLoginForm = () => {
    const { chat } = this.props;
    chat.switchUserInput(withChatForm((props) => (
      <ChatForm
        {...props}
        autoFocus={true}
        keyboardType='numeric'
        maxLength={12}
        submitText={'Logga in'}
        placeholder={'Ange ditt personnummer'}
      />
    ), {
      onSubmit: this.authenticateUser
    }));
  }

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
    if (message.search('Logga in') !== -1) {
      this.showLoginForm();
      return;
    }
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

      if (lastMsg.modifiers[0] === 'user') {
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







const styles = StyleSheet.create({
  paper: {
      backgroundColor: '#fff',
      padding: 24,
      borderRadius: 7,
      shadowOpacity: 0.2,
      shadowRadius: 2,
      shadowColor: '#000',
      shadowOffset: { height: 5, width: 0 },
  },
  container: {
      alignItems: 'stretch',
  },
  content: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
  },
  loginContainer: {
      flex: 0,
      width: '100%',
      marginBottom: 30
  },
  loginFooter: {
      marginTop: 42,
      marginBottom: 26,
      alignItems: 'center',
  },
  button: {
      paddingTop: 16,
      paddingBottom: 16,
      backgroundColor: '#007AFF',
      borderRadius: 7,
  },
  buttonDisabled: {
      backgroundColor: '#E5E5EA',
  },
  buttonText: {
      fontSize: 18,
      color: '#fff',
      textAlign: 'center',
      fontWeight: 'bold',
  },
  buttonTextDisabled: {
      color: '#C7C7CC',
  },
  header: {
      fontWeight: 'bold',
      fontSize: 35,
      textAlign: 'center',
  },
  infoText: {
      fontSize: 18,
      fontWeight: 'bold',
      textAlign: 'center',
      marginTop: 24,
      marginBottom: 24
  },
  label: {
      fontSize: 16,
      marginBottom: 8,
  },
  inputField: {
      height: 40,
      borderColor: 'transparent',
      borderBottomColor: '#D3D3D3',
      borderWidth: 0.5,
      marginBottom: 24,
      color: '#555',
  },
});