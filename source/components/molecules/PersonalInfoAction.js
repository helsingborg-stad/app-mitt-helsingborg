import React, { Component } from 'react';
import { Button } from '../Components';

class PersonalInfoAction extends Component {
    constructor(props) {
        super(props);
    }

    onClick = () => {
        this.props.addMessages(
            MESSAGES
        );

        this.props.setActions([]);
    }

    render() {
        return <Button
            value={'Mina personuppgifter?'}
            onClick={this.onClick} />;
    }
};

export default PersonalInfoAction;

const MESSAGES = [
    {
        type: 'chatBubble',
        modifiers: ['user'],
        value: "Berätta mer om mina personuppgifter"
    },
    {
        type: 'chatBubble',
        modifiers: ['automated'],
        value: "Info om personuppgifter kommer här"
    }
];
