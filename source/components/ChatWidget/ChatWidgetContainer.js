import React, { Component } from 'react'
import { Text, View } from 'react-native'
import ChatWidget from './ChatWidget';

export default class ChatWidgetContainer extends Component {
    state = {
        users: [],
        currentRoomId: 0,
        currentUserId: 1,
        newMessage: '',
        messages: [],
        isLoading: false
    }

    componentWillMount()
    {
        this.setState({messages: mockMessages, users: users});
    }

    handleChange = (value) => {
        this.setState({ newMessage: value });
    };

    handleSubmit = event => {
        const { newMessage, currentUserId, messages } = this.state;

        if (typeof newMessage === 'string' && newMessage.length > 0) {
            messages.push({
                userId: currentUserId,
                content: newMessage,
                timestamp: Date.now()
            });

            this.setState({ newMessage: '' , messages: messages});
        }
    }

    render() {
        const {messages, newMessage, currentUserId} = this.state;
        return (
            <ChatWidget
                messages={messages.map(message => {
                    message.currentUser = false;
                    if (message.userId === currentUserId) {
                        message.currentUser = true;
                    }

                    return message;
                })}
                currentUserId={0}
                inputValue={newMessage}
                changeHandler={this.handleChange}
                submitHandler={this.handleSubmit}
            />
        )
    }
}

const mockMessages = [
    {
        userId: 1,
        timestamp: 1563997170,
        content: 'Hej',
    },
    {
        userId: 2,
        timestamp: 1563997549,
        content: 'Hej vad kan jag hjälpa dig med?',
    },
];

const users = [
    {
        userId: 1,
        userName: 'Nikolas'
    },
    {
        userId: 2,
        userName: 'Random Hero'
    }
];
