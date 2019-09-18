import React, { Component } from 'react';
import { Button } from '../Components';

class MoreInfo extends Component {
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
            value={'Berätta mer'}
            modifiers={['primary']}
            onClick={this.onClick} />;
    }
};

export default MoreInfo;

const MESSAGES = [
    {
        type: 'chatBubble',
        modifiers: ['user'],
        value: "Berätta mer"
    },
    {
        type: 'chatBubble',
        modifiers: ['automated'],
        value: "Absolut!"
    },
    {
        type: 'chatBubble',
        modifiers: ['automated'],
        value: "Med Mitt Helsingborg kommunicerar du med staden och får tillgång till alla tjänster du behöver."
    },
    {
        type: 'chatBubble',
        modifiers: ['automated'],
        value: "Allt samlat i mobilen!"
    },
];

const ACTIONS = [
    {
        type: 'chatSectionTitle',
        value: "Hur vill du fortsätta?"
    },
    {
        type: 'component',
        value: "loginAction"
    },
    {
        type: 'component',
        value: "moreInfoExpanded"
    },
]
