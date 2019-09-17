import React, { Component } from 'react';
import { Button } from '../Components';

class LoginAction extends Component {
    loginClicked = () => {
        this.props.activateFormInput('login');

        this.props.addMessages(
            MESSAGES
        );

        this.props.setActions(
            ACTIONS
        );
    }

    render() {
        return (
            <Button
                onClick={() => this.loginClicked()}
                value="Logga in med Mobilt BankID"
            />
        );
    }
}

export default LoginAction;

const MESSAGES = [
    {
        type: 'string',
        modifiers: ['user'],
        value: "Logga in med Mobilt BankID"
    },
    {
        type: 'string',
        modifiers: ['automated'],
        value: "Eftersom det är första gången du loggar in behöver du ange ditt personnummer"
    },
]

const ACTIONS = [
    {
        type: 'separator',
        value: "Eller lär dig mer om Mitt Helsingborg"
    },
    {
        type: 'component',
        value: 'personalInfoAction'
    }
]
