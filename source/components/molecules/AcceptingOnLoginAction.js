import React, { Component } from 'react';
import Button from '../atoms/Button';

class AcceptingOnLoginAction extends Component {
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
            value={'Vad godkänner jag när jag loggar in?'}
            onClick={this.onClick} />;
    }
};

export default AcceptingOnLoginAction;

const MESSAGES = [
    {
        type: 'chatBubble',
        modifiers: ['user'],
        value: "Vad godkänner jag när jag loggar in?"
    },
    {
        type: 'chatBubble',
        modifiers: ['automated'],
        value: "Du godkänner ditten och datten"
    }
];

const ACTIONS = [
    {
        type: 'chatSectionTitle',
        value: "Lär dig mer om Mitt Helsingborg"
    },
    {
        type: 'component',
        value: 'personalInfoAction'
    }
]
