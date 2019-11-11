import React, { Component } from 'react'
import PropTypes from 'prop-types';

import ChatMessages from '../molecules/ChatMessages';
import Modal from '../molecules/Modal';

import ChatBody from '../atoms/ChatBody';
import ChatWrapper from '../atoms/ChatWrapper';
import ChatFooter from '../atoms/ChatFooter';

import EventHandler, { EVENT_USER_MESSAGE } from '../../helpers/EventHandler';

import ChatUserInput from '../molecules/ChatUserInput';

class Chat extends Component {
    static propTypes = {
        ChatAgent: PropTypes.oneOfType([PropTypes.oneOf([false]), PropTypes.elementType, PropTypes.func]).isRequired,
        ChatUserInput: PropTypes.oneOfType([PropTypes.oneOf([false]), PropTypes.elementType, PropTypes.func]),
        inputComponents: PropTypes.array
    };

    static defaultProps = {
        ChatAgent: false,
        ChatUserInput: false,
        inputComponents: []
    };

    state = {
        messages: [],
        ChatAgent: false,
        inputComponents: [],
        // TODO: Move inputActions state outside of Chat organism
        inputActions: [],
        modal: {
            visible: false,
            heading: '',
            content: ''
        }
    };

    componentDidMount() {
        const { ChatAgent, ChatUserInput, inputComponents } = this.props;

        if (ChatAgent) {
            this.switchAgent(ChatAgent);
        }

        if (inputComponents) {
            this.switchInput(inputComponents);
        }

        // Fix for components using old API to prevent breaking app
        if (ChatUserInput) {
            this.switchUserInput(ChatUserInput);
        }
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

    switchInput = (inputArr) => {
        if (inputArr === false) {
            this.setState({ inputComponents: [] });
            return;
        }

        const inputArray = !Array.isArray(inputArr) ? [inputArr] : inputArr;

        this.setState({ inputComponents: inputArray });
    }

    /**
     * switchUserInput will be removed in favor of switchInput
     * @deprecated
     */
    switchUserInput = (Component, componentProps = {}) => {
        this.switchInput(Component ? {
            type: 'custom',
            Component,
            componentProps
        } : false);
    }

    // TODO: Implement setInputActions functionality outside of Chat organism
    setInputActions = (inputActions) => {
        this.setState({
            inputActions
        });
    }

    /**
     * Changes modal state
     *
     * @param {bool} visible
     * @param {string} heading
     * @param {string} content
     */
    changeModal = (visible, heading = '', content = '') => {
        this.setState({
            modal: {
                visible,
                heading,
                content
            }
        });
    }

    render() {
        const { messages, ChatAgent, inputComponents, modal } = this.state;
        const { addMessages, switchAgent, switchUserInput, switchInput, setInputActions, changeModal } = this;
        const instanceMethods = { addMessages, switchAgent, switchUserInput, switchInput, setInputActions, changeModal };

        return (
            <ChatWrapper keyboardVerticalOffset={24} >
                {ChatAgent ?
                    <ChatAgent chat={{ ...instanceMethods, ...this.state }} />
                    : null}
                <ChatBody>
                    <ChatMessages messages={messages} chat={{ ...instanceMethods, ...this.state }} />
                </ChatBody>
                <ChatFooter>
                    {inputComponents && inputComponents.length > 0 ?
                        <ChatUserInput inputArray={inputComponents} chat={{ ...instanceMethods, ...this.state }} />
                        : null}
                </ChatFooter>
                <Modal
                    {...modal}
                    changeModal={(visible) => this.changeModal(visible)}
                />
            </ChatWrapper>
        )
    }
}

export default Chat;
