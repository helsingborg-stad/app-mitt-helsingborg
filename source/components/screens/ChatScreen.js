import React, { Component } from 'react'
import ScreenWrapper from '../molecules/ScreenWrapper'
import Chat from '../organisms/Chat';
import ExampleAgent from '../organisms/ExampleAgent';
import withChatForm from '../organisms/withChatForm';
import ChatForm from '../molecules/ChatForm';
class ChatScreen extends Component {
    render() {
        return (
            <ScreenWrapper>
                <Chat ChatAgent={ExampleAgent} ChatUserInput={withChatForm(ChatForm)} />       
            </ScreenWrapper>
        )
    }
}

export default ChatScreen;