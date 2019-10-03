import React, { Component } from 'react';
import Button from '../atoms/Button';

class MoreInfoExpanded extends Component {
    constructor(props) {
        super(props);
    }

    onClick = () => {
        this.props.addMessages(
            MESSAGES
        );

        this.props.setActions(
            ACTIONS
        );
    }

    render() {
        return <Button
            value={'Berätta ännu mer!'}
            onClick={this.onClick} />;
    }
};

export default MoreInfoExpanded;

const MESSAGES = [
    {
        type: 'chatBubble',
        modifiers: ['user'],
        value: "Berätta ännu mer"
    },
    {
        type: 'chatBubble',
        modifiers: ['automated'],
        value: "Här kommer ännu mer info!"
    }
];

const ACTIONS = [
    {
        type: 'chatSectionTitle',
        value: "Hur vill du fortsätta?"
    },
    {
        type: 'component',
        value: "loginAction"
    }
];
