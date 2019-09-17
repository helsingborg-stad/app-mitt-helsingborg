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
        type: 'string',
        modifiers: ['automated'],
        value: "Info om personuppgifter"
    }
];
