import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';

import env from 'react-native-config';
import { storiesOf } from '@storybook/react-native';
import styled from 'styled-components/native'

import EventHandler, { EVENT_USER_MESSAGE } from '../../helpers/EventHandler';

import withChatForm from '../organisms/withChatForm';

import StoryWrapper from '../molecules/StoryWrapper';
import ChatForm from '../molecules/ChatForm';
import ChatMessages from '../molecules/ChatMessages';

import ChatBody from '../atoms/ChatBody';
import ChatWrapper from '../atoms/ChatWrapper';
import ChatFooter from '../atoms/ChatFooter';
import ChatBubble from '../atoms/ChatBubble';

import Button from '../atoms/Button';
import Text from '../atoms/Text';
import Heading from '../atoms/Heading';
import Icon from '../atoms/Icon';

import withAuthentication from '../organisms/withAuthentication';
import { sanitizePin, validatePin } from "../../helpers/ValidationHelper";


import WatsonAgent from '../organisms/WatsonAgent';

let months = {};
months[9] = "Oktober";
months[10] = "November";

class LoginAgent extends Component {
  componentDidMount() {
    const { chat } = this.props;

    chat.addMessages([
      {
        Component: props => (<ChatBubble {...props}><Heading>Hej!</Heading></ChatBubble>),
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

  handleHumanChatMessage = (message) => {
    const { chat } = this.props;
    if (message.search('Jag vill logga in med Mobilt BankID') !== -1) {
      this.showLoginForm();
      return;
    }

    if (message.search('Jag vill veta mer om Mitt Helsingborg')  !== -1) {

      chat.switchUserInput(props => (<ChatForm {...props} hideUserInput />));

      chat.addMessages([
        {
          Component: props => (<ChatBubble {...props}><Heading>Absolut!</Heading></ChatBubble>),
          componentProps: {
            modifiers: ['automated'],
          }
        },
        {
          Component: ChatBubble,
          componentProps: {
            content: 'Med Mitt Helsingborg kommunicerar du med staden och får tillgång till alla tjänster du behöver.',
            modifiers: ['automated'],
          }
        },
        {
          Component: ChatBubble,
          componentProps: {
            content: 'Allt samlat i mobilen!',
            modifiers: ['automated'],
          }
        }
      ]);

      chat.setInputActions([
        {
          Component: InputAction,
          componentProps: {
            label: 'Jag vill logga in med Mobilt BankID',
            messages: [{
              Component: ChatBubble,
              componentProps: {
                content: 'Jag vill logga in med Mobilt BankID',
                modifiers: ['user'],
  
              }
            }]
          },
        },
      ]);
    }
  };

  showInitialUserInput = () => {
    const { chat } = this.props;

    chat.switchUserInput(props => (<ChatForm {...props} hideUserInput />));

    chat.setInputActions([
      {
        Component: InputAction,
        componentProps: {
          label: 'Jag vill logga in med Mobilt BankID',
          messages: [{
            Component: ChatBubble,
            componentProps: {
              content: 'Jag vill logga in med Mobilt BankID',
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
              content: 'Jag vill veta mer om Mitt Helsingborg',
              modifiers: ['user'],

            }
          }]
        },
      },
    ]);
  }

  showLoginForm = () => {
    const { chat } = this.props;


    chat.addMessages([
      {
        Component: ChatBubble,
        componentProps: {
          content: 'Eftersom det är första gången du loggar in behöver du ange ditt personnummer.',
          modifiers: ['automated'],
        }
      }
    ]);
    

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

    chat.setInputActions([
      {
        Component: InputAction,
        componentProps: {
          label: 'Jag vill veta mer om Mitt Helsingborg',
          messages: [{
            Component: ChatBubble,
            componentProps: {
              content: 'Jag vill veta mer om Mitt Helsingborg',
              modifiers: ['user'],

            }
          }]
        },
      },
    ]);
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

    chat.switchUserInput(() => (
      <BankIdLoading 
        {...this.props.authentication } 
        cancelLogin={() => {
          this.props.authentication.cancelLogin();
          this.showInitialUserInput();
    
        }} 
      />
    ));

    try {
      const { loginUser } = this.props.authentication;
      await loginUser(personalNumber);

      const today = new Date();

      chat.addMessages([
        {
          Component: ChatDivider,
          componentProps: {
            title: `${new Date().getDay()} ${months[new Date().getMonth()]}`,
            info: 'Loggade in med Mobilt BankID',
          }
        }
      ]);

      chat.switchAgent(WatsonAgent);
      chat.switchUserInput(withChatForm(ChatForm));
      chat.setInputActions([]);
    } catch (e) {
      if (e.message !== 'cancelled') {
        Alert.alert(e.message);
      }
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


const ChatDivider = props => (
  <DividerWrapper>
      <DividerTitle>{props.title}</DividerTitle>
      <DividerLine/>
      <DividerInfo>{props.info}</DividerInfo>
  </DividerWrapper>
);

const DividerLine = styled.View`
  height: 1px;
  width: 100%;
  flex: 1;
  background-color: ${props => props.theme.border.default};
  align-self: stretch;
  margin-vertical: 6px;
  flex-shrink: 0;
`;

const DividerWrapper = styled.View`
  align-self: stretch;
  margin-top: 48px;
  margin-bottom: 24px;
  margin-left: 16px;
  margin-right: 16px;
`;
const DividerTitle = styled(Text)`
  text-align: center;
  flex: 1;
  flex-shrink: 0;
  margin-bottom: 4px;
  margin-top: 4px;
  font-size: 14px;
  font-weight: 400;
`;
const DividerInfo = styled(Text)`
  text-align: center;
  flex: 1;
  flex-shrink: 0;
  font-size: 12px;
`;

const BankIdLoading = props => (  
<View style={styles.container}>
  <View style={styles.content}>
      <ActivityIndicator size="large" color="slategray" />
      {!props.isBankidInstalled &&
          <Text style={styles.infoText}>Väntar på att BankID ska startas på en annan enhet</Text>
      }
  </View>
  <View style={styles.loginContainer}>
    <Button block color={'purple'}><Text>Avbryt</Text></Button>
  </View>
</View>);

const styles = StyleSheet.create({
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
  infoText: {
      fontSize: 18,
      fontWeight: 'bold',
      textAlign: 'center',
      marginTop: 24,
      marginBottom: 24
  },
});



storiesOf('Chat', module)
  .add('Login agent', () => (
    <ChatScreen />
  ));