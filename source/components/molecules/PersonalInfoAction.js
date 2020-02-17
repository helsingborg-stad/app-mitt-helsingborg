import React, { Component } from 'react';
import Button from '../atoms/ButtonDeprecated';

class PersonalInfoAction extends Component {
  constructor(props) {
    super(props);
  }

  onClick = () => {
    this.props.addMessages(MESSAGES);

    this.props.setActions(ACTIONS);
  };

  render() {
    return <Button value="Mina personuppgifter?" onClick={this.onClick} />;
  }
}

export default PersonalInfoAction;

const MESSAGES = [
  {
    type: 'chatBubble',
    modifiers: ['user'],
    value: 'Berätta mer om mina personuppgifter',
  },
  {
    type: 'chatBubble',
    modifiers: ['automated'],
    value: 'Info om personuppgifter kommer här',
  },
];

const ACTIONS = [
  {
    type: 'chatSectionTitle',
    value: 'Lär dig mer om Mitt Helsingborg',
  },
  {
    type: 'component',
    value: 'acceptingOnLoginAction',
  },
];
