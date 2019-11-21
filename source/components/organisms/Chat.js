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
        inputComponents: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
        keyboardVerticalOffset: PropTypes.number
    };

    static defaultProps = {
        ChatAgent: false,
        ChatUserInput: false,
        inputComponents: [],
        keyboardVerticalOffset: 24
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
        },
        isTyping: false
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

    toggleTyping = async () => {
        await this.setState(prevState => ({isTyping: !prevState.isTyping}));
    }

    addMessages = async (objects) => {
        const array = Array.isArray(objects) ? objects : [objects];

        await this.setState(prevState => {
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

    switchAgent = async (AgentComponent) => {
        await this.setState({
            ChatAgent: AgentComponent
        });
    }

    switchInput = async (inputArr) => {
        if (inputArr === false) {
            await this.setState({ inputComponents: [] });
            return;
        }

        const inputArray = !Array.isArray(inputArr) ? [inputArr] : inputArr;

        await this.setState({ inputComponents: inputArray });
    }

    /**
     * switchUserInput will be removed in favor of switchInput
     * @deprecated
     */
    switchUserInput = async (Component, componentProps = {}) => {
        await this.switchInput(Component ? {
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
        const { keyboardVerticalOffset } = this.props;
        const { messages, ChatAgent, inputComponents, modal, isTyping } = this.state;
        const { addMessages, switchAgent, switchUserInput, switchInput, setInputActions, changeModal, toggleTyping } = this;
        const instanceMethods = { addMessages, switchAgent, switchUserInput, switchInput, setInputActions, changeModal, toggleTyping };

        return (
            <ChatWrapper keyboardVerticalOffset={keyboardVerticalOffset} >
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
