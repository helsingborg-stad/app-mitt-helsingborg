import React, { Component } from 'react'

import ChatBubble from '../atoms/ChatBubble';
import ExampleAgentTwo from './ExampleAgentTwo';

let COUNTER = 0;

export default class ExampleAgent extends Component {
    componentDidMount() {
        const { chat } = this.props;

        if (COUNTER > 10) {
            return;
        }

        chat.addMessages({
            Component: ChatBubble,
            componentProps: {
                content: 'Hello from agent 1',
                modifiers: ['automated'],
            }
        });

        setTimeout(() => {
            COUNTER++;
            chat.switchAgent(ExampleAgentTwo);
        }, 1000);
    }

    render() {
        return null;
    }
}


