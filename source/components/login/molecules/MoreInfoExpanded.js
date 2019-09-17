import React, { Component } from 'react';
import { Button } from '../Components';

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
        type: 'string',
        modifiers: ['user'],
        value: "Berätta ännu mer"
    },
    {
        type: 'string',
        modifiers: ['automated'],
        value: "Här kommer ännu mer info!"
    }
];

const ACTIONS = [
    {
        type: 'separator',
        value: "Hur vill du fortsätta?"
    },
    {
        type: 'component',
        value: "loginAction"
    }
];
