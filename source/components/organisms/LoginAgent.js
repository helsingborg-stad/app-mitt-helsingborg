import React, { Component } from 'react';
import { Alert, TouchableOpacity  } from 'react-native';
import EventHandler, { EVENT_USER_MESSAGE } from '../../helpers/EventHandler';
import withChatForm from './withChatForm';
import ChatForm from '../molecules/ChatForm';

import { validatePin } from "../../helpers/ValidationHelper";
import WatsonAgent from './WatsonAgent';

import ChatDivider from "../atoms/ChatDivider";

import ChatBubble from '../atoms/ChatBubble';

import Heading from '../atoms/Heading';
import Button from '../atoms/Button';
import Text from '../atoms/Text';
import Icon from '../atoms/Icon';
import ChatBankIdLoading from '../atoms/ChatBankIdLoading';
import withAuthentication from './withAuthentication';

export default withAuthentication(class LoginAgent extends Component {
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

  componentWillUnmount() {
    EventHandler.unSubscribe(EVENT_USER_MESSAGE);
  }

  handleHumanChatMessage = (message) => {
    const { chat } = this.props;
    if (message.search('Jag vill logga in med Mobilt BankID') !== -1) {
      this.showLoginForm();
      return;
    }
    if (message.search('Jag vill veta mer om Mitt Helsingborg') !== -1) {
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
  };

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
    chat.switchUserInput(withChatForm((props) => (<ChatForm {...props} autoFocus={true} keyboardType='numeric' maxLength={12} submitText={'Logga in'} placeholder={'Ange ditt personnummer'} />), {
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
  };

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

    // TODO: Cancel not working
    chat.switchUserInput(() => (<ChatBankIdLoading {...this.props.authentication} cancelLogin={() => {
      this.props.authentication.cancelLogin();
      this.showInitialUserInput();
    }} />));

    try {
      const { loginUser } = this.props.authentication;
      await loginUser(personalNumber);
      let months = {};
      months[9] = "Oktober";
      months[10] = "November";
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

const InputAction = (props) => {
  return <Button onClick={() => props.addMessages(props.messages)} color={'light'} rounded>
    <Icon name="message" />
    <Text>{props.label}</Text>
  </Button >;
}


