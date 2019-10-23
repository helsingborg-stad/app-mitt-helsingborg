import React, { Component } from 'react'
import PropTypes from 'prop-types';

import ChatMessages from '../molecules/ChatMessages';

import ChatBody from '../atoms/ChatBody';
import ChatWrapper from '../atoms/ChatWrapper';
import ChatFooter from '../atoms/ChatFooter';

import EventHandler, { EVENT_USER_MESSAGE } from '../../helpers/EventHandler';

class Chat extends Component {
    state = {
        messages: [],
        ChatUserInput: false,
        ChatAgent: false,
        // TODO: Move inputActions state outside of Chat organism
        inputActions: []
    };

    componentDidMount() {
        const {ChatUserInput, ChatAgent} = this.props;
        this.setState({ChatUserInput, ChatAgent});
    }

    addMessages = (objects) => {
        const array = Array.isArray(objects) ? objects : [objects];

        this.setState(prevState => {
          let { messages } = prevState;
          // TODO: loop through message array & setState for each separately (or dispatch will fail if more then 1 message)
          array.forEach(object => { messages.push(object) });
          return { messages };
        }, this.dispatchMessageEvents);
    };

    dispatchMessageEvents = () => {
        const lastMsg = this.state.messages.slice(-1)[0].componentProps;
    
        if (Array.isArray(lastMsg.modifiers) && lastMsg.modifiers[0] === 'user') {
          EventHandler.dispatch(EVENT_USER_MESSAGE, lastMsg.content);
        }
    }

    switchAgent = (AgentComponent) => {
        this.setState({
            ChatAgent: AgentComponent
        });
    }

    switchUserInput = (UserInputComponent) => {
        this.setState({
            ChatUserInput: UserInputComponent
        });
    }

    // TODO: Implement setInputActions functionality outside of Chat organism
    setInputActions = (inputActions) => {
        this.setState({
            inputActions
        });
    }

    render() {
        const { messages, ChatAgent, ChatUserInput } = this.state;
        const { addMessages, switchAgent, switchUserInput, setInputActions } = this;

        const instanceMethods = { addMessages, switchAgent, switchUserInput, setInputActions };

        return (
            <ChatWrapper keyboardVerticalOffset={24} >
                {ChatAgent ?
                    <ChatAgent chat={{...instanceMethods, ...this.state}} /> 
                : null}
                <ChatBody> 
                    <ChatMessages messages={messages} />
                </ChatBody>
                <ChatFooter>
                    {ChatUserInput ?
                        <ChatUserInput chat={{...instanceMethods, ...this.state}} /> 
                    : null}
                </ChatFooter>
            </ChatWrapper>
        )
    }
}

Chat.propTypes = {
    ChatAgent: PropTypes.oneOfType([PropTypes.oneOf([false]), PropTypes.elementType, PropTypes.func]).isRequired,
    ChatUserInput: PropTypes.oneOfType([PropTypes.oneOf([false]), PropTypes.elementType, PropTypes.func]).isRequired
};

Chat.defaultProps = {
    ChatAgent: false,
    ChatUserInput: false
};

export default Chat;