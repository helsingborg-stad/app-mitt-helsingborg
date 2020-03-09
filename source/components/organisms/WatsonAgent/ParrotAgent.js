/* eslint-disable no-param-reassign */
/* eslint-disable react/prop-types */
import { Component } from 'react';
import ChatBubble from '../../atoms/ChatBubble';
import EventHandler, { EVENT_USER_MESSAGE } from '../../../helpers/EventHandler';
import WatsonAgent from './WatsonAgent';

export default class ParrotAgent extends Component {
  componentDidMount() {
    const { chat } = this.props;

    chat.addMessages({
      Component: ChatBubble,
      componentProps: {
        content: 'Skriv Watson för att byta agent.',
        modifiers: ['automated'],
      },
    });

    EventHandler.subscribe(EVENT_USER_MESSAGE, message => this.handleHumanChatMessage(message));
  }

  componentWillUnmount() {
    EventHandler.unSubscribe(EVENT_USER_MESSAGE);
  }

  handleHumanChatMessage = message => {
    const { chat } = this.props;

    if (message.search('Watson') !== -1) {
      chat.switchAgent(WatsonAgent);

      message = 'Byter till agent Watson.';
    }

    chat.addMessages({
      Component: ChatBubble,
      componentProps: {
        content: `Papegoja säger: ${message}`,
        modifiers: ['automated'],
      },
    });
  };

  render() {
    return null;
  }
}
