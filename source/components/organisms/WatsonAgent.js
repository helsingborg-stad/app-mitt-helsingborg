import React, { Component } from 'react';
import env from 'react-native-config';
import EventHandler, { EVENT_USER_MESSAGE } from '../../helpers/EventHandler';
import { sendChatMsg } from '../../services/ChatFormService';
import ChatBubble from '../atoms/ChatBubble';
import ButtonStack from '../molecules/ButtonStack';
import { Alert, } from "react-native";
import StorageService, { USER_KEY } from "../../services/StorageService";
import Markdown from "react-native-simple-markdown";

let context;

export default class WatsonAgent extends Component {
    state = {
        disableAgent: false
    };

    componentDidMount() {
        const { chat, initialMessages } = this.props;

        if (initialMessages !== undefined && Array.isArray(initialMessages)) {
            initialMessages.forEach((message) => {
                chat.addMessages({
                    Component: ChatBubble,
                    componentProps: {
                        content: message,
                        modifiers: ['automated'],
                    }
                });
            })
        } else if (initialMessages !== undefined && initialMessages === 'remote') {
             // Show welcome message from Watson
            this.handleHumanChatMessage('');
        } else {
            StorageService.getData(USER_KEY).then(({ name }) => {
                chat.addMessages({
                    Component: ChatBubble,
                    componentProps: {
                        content: `Hej ${name}!\nKul att du har loggat in i Mitt Helsingborg.`,
                        modifiers: ['automated'],
                    }
                });

                chat.addMessages({
                    Component: ChatBubble,
                    componentProps: {
                        content: 'Här kan du använda tjänster och få information från kommunen.\nVad vill du göra?',
                        modifiers: ['automated'],
                    }
                });

                chat.addMessages({
                    Component: (props) => <ButtonStack {...props} chat={chat} />,
                    componentProps: {
                        items: [
                            {
                                value: 'Boka borgerlig vigsel',
                                icon: 'wc'
                            },
                            {
                                value: 'Fråga om borgerlig vigsel',
                                icon: 'help-outline'
                            }
                        ]
                    }
                });
            });
        }

        EventHandler.subscribe(EVENT_USER_MESSAGE, (message) => this.handleHumanChatMessage(message));
    }

    componentWillUnmount() {
        EventHandler.unSubscribe(EVENT_USER_MESSAGE);
    }

    /**
     * Parse metadata found in text strings
     * @param {string} value
     */
    captureMetaData(value) {
        if (typeof value !== 'string') {
            return {};
        }

        const match = /{([a-z0-9\s.,_\'"-\[\]:{}]+)}/g.exec(value);
        let meta = match && typeof match[1] !== 'undefined' ? match[1] : undefined;

        try {
            meta = JSON.parse(meta);
        } catch (error) {
            return {};
        }

        return meta;
    }

    handleHumanChatMessage = async (message) => {
        const { chat } = this.props;
        const workspaceId = env.WATSON_WORKSPACEID;
        if (workspaceId === undefined) {
            Alert.alert('Missing Watson workspace ID');
        }
        else {
            let chatMessages = [];
            let chatOptions = [];
            let inputOptions = [];
            try {
                await sendChatMsg(workspaceId, message, context).then((response) => {
                    // Set context for every response
                    context = response.data.attributes.context;

                    const responseGeneric = response.data.attributes.output.generic;

                    responseGeneric.forEach(elem => {
                        if (elem.response_type === 'text') {
                            chatMessages.push({
                                content: elem.text
                            });
                        }

                        if (elem.response_type === 'option' && elem.options) {
                            elem.options.forEach((option) => {
                                const meta = this.captureMetaData(option.value.input.text);
                                const button = { value: option.label, ...meta }
                                if (meta.type && meta.type === 'chat') {
                                    chatOptions.push(button);
                                } else {
                                    inputOptions.push(button);
                                }
                            });
                        }
                    });
                });
            }
            catch (e) {
                console.log('SendChat error: ', e);
                chatMessages = [{content: 'Kan ej svara på frågan. Vänta och prova igen senare.'}];
            }

            if (!this.state.disableAgent) {
                // Output chat messages
                chatMessages.forEach(chatMessage => {
                         chat.addMessages({
                             Component: props => <ChatBubble {...props}>
                                 <Markdown styles={markdownStyles}>{chatMessage.content}</Markdown>
                             </ChatBubble>,
                             componentProps: {
                                 content: chatMessage.content,
                                 modifiers: ['automated'],
                             }
                        });
                });

                // Output chat options
                if (chatOptions.length > 0) {
                    chat.addMessages({
                        Component: (props) => <ButtonStack {...props} chat={chat} />,
                        componentProps: {
                            items: chatOptions
                        }
                    });
                }

                let input = [{
                    type: 'text',
                    placeholder: 'Skriv något...',
                    autoFocus: false,
                }];

                // Output input options
                if (inputOptions.length > 0) {
                    input = [{
                        type: 'radio',
                        options: inputOptions,
                    }];
                }

                chat.switchInput(input);
            }
        }
    };
    render() {
        return null;
    }
}

const markdownStyles = {
    text: {
        color: '#707070',
        fontSize: 16,
        fontStyle: 'normal',
        fontWeight: '500',
        fontFamily: 'Roboto'
    }
};
