import React, { Component } from 'react'
import { Text, View } from 'react-native'
import { withNavigation } from 'react-navigation'
import ChatWidget from './ChatWidget'

import ChatSocket from '../../services/ChatSocket'


const { joinChat, subscribeToMessages, disconnect, message } = ChatSocket()
export default withNavigation(class ChatWidgetContainer extends Component {
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
     
        joinChat({agentId: 2, message: 'lol'}, (response, status) => {
            const {messages, members, conversationId} = response.data;
            console.log("TCL: ChatWidgetContainer -> response", response)

            this.setState({
                users: members,
                messages: messages,
                currentRoomId: conversationId
            });

            subscribeToMessages(response => {
                this.setState({messages: response.data.messages})
            });
        });
    }

    componentWillUnmount()
    {
        unsubscribeToMessages();
        disconnect();
    }

    handleChange = (value) => {
        this.setState({ newMessage: value });
    };

    handleSubmit = event => {
        const { newMessage, currentUserId, messages, users, currentRoomId } = this.state;

        if (typeof newMessage === 'string' && newMessage.length > 0) {
            message({
                conversationId: currentRoomId,
                from: currentUserId,
                to: users.map(user => user.id).filter(id => id != currentUserId),
                body: newMessage,
            });

            this.setState({ newMessage: ''});
        }
    }

    render() {
        const {messages, newMessage, currentUserId} = this.state;
        return (
            <ChatWidget
                messages={messages.map(message => {
                    message.currentUser = false;
                    if (message.from == currentUserId) {
                        message.currentUser = true;
                    }

                    return message;
                })}
                currentUserId={currentUserId}
                inputValue={newMessage}
                changeHandler={this.handleChange}
                submitHandler={this.handleSubmit}
            />
        )
    }
});

const mockMessages = [
    {
        id: 1,
        timestamp: 1563997170,
        content: 'Hej',
    },
    {
        id: 2,
        timestamp: 1563997549,
        content: 'Hej vad kan jag hjälpa dig med?',
    },
];

const users = [
    {
        id: 1,
        userName: 'Nikolas'
    },
    {
        id: 2,
        userName: 'Random Hero'
    }
];
