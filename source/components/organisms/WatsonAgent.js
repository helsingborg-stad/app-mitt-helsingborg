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

        if (initialMessages !== undefined) {
            initialMessages.forEach((message) => {
                chat.addMessages({
                    Component: ChatBubble,
                    componentProps: {
                        content: message,
                        modifiers: ['automated'],
                    }
                });
            })
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
                                icon: 'helper'
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

        const match = /{([a-z0-9\s.,_\'"\[\]:{}]+)}/g.exec(value);
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
            let responseMessages = [];
            let options = [];
            try {
                await sendChatMsg(workspaceId, message, context).then((response) => {
                    // Set context for every response
                    context = response.data.attributes.context;

                    const responseGeneric = response.data.attributes.output.generic;

                    responseGeneric.forEach(elem => {
                        if (elem.response_type === 'text') {
                            responseMessages.push(elem.text);
                        }

                        if (elem.response_type === 'option' && elem.options) {
                            elem.options.forEach((option) => {
                                const { action, icon, iconColor } = this.captureMetaData(option.value.input.text);
                                options.push({
                                    value: option.label,
                                    action: action || undefined,
                                    icon: icon || undefined,
                                    iconColor: iconColor || undefined,
                                })
                            });
                        }
                    });
                });
            }
            catch (e) {
                console.log('SendChat error: ', e);
                responseMessages = ['Kan ej svara på frågan. Vänta och prova igen senare.'];
            }

            if (!this.state.disableAgent) {
                responseMessages.forEach(message => {
                    chat.addMessages(
                        {
                            Component: props => (<ChatBubble {...props}><Markdown styles={markdownStyles}>{message}</Markdown></ChatBubble>),
                            componentProps: {
                                content: message,
                                modifiers: ['automated'],
                            }
                        }
                    );
                });

                let inputArray = [{
                    type: 'text',
                    placeholder: 'Skriv något...',
                }];

                if (options.length > 0) {
                    inputArray = [{
                        type: 'radio',
                        options,
                    }];
                }

                chat.switchInput(inputArray);
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
