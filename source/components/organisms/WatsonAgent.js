import React, { Component } from 'react';
import env from 'react-native-config';
import EventHandler, { EVENT_USER_MESSAGE } from '../../helpers/EventHandler';
import { sendChatMsg } from '../../services/ChatFormService';
import ChatBubble from '../atoms/ChatBubble';
import ButtonStack from '../molecules/ButtonStack';
import StorageService, { COMPLETED_FORMS_KEY, USER_KEY } from '../../services/StorageService';
import MarkdownConstructor from "../../helpers/MarkdownConstructor";
import { Alert, } from "react-native";

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
                        content: `Hej och välkommen till Mitt Helsingborg! Jag heter Sally. Jag kan hjälpa dig med att svara på frågor och guida dig runt i appen.`,
                        modifiers: ['automated'],
                    }
                });

                chat.addMessages({
                    Component: ChatBubble,
                    componentProps: {
                        content: 'Vad vill du göra?',
                        modifiers: ['automated'],
                    }
                });

                chat.addMessages({
                    Component: (props) => <ButtonStack {...props} chat={chat} />,
                    componentProps: {
                        items: [
                            {
                                value: 'Test service',
                                action: {
                                    'type': 'form',
                                    'value': 2,
                                    'callback': (params) => this.onFormEnd(params)
                                }
                            },
                            {
                                value: 'Jag vill boka borgerlig vigsel',
                                icon: 'wc'
                            },
                            {
                                value: 'Jag har frågor om borgerlig vigsel',
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
     * Callback method to run after form is done
     * @param {object}
     *
     * TODO: Move somewhere else?
     */
    onFormEnd = async ({ form, answers }) => {
        const { chat } = this.props;

        const user = await StorageService.getData(USER_KEY);

        const formData = {
            id: +new Date,
            userId: user.personalNumber,
            formId: form.id,
            created: new Date(),
            lastUpdated: new Date(),
            status: 'completed',
            data: answers,
        }

        try {
            await StorageService.putData(COMPLETED_FORMS_KEY, formData);
        } catch (error) {
            console.log("Save form error", error);
        }

        await chat.addMessages([
            {
                Component: (props) => <ButtonStack {...props} chat={chat} />,
                componentProps: {
                    items: [
                        {
                            value: 'Visa mina ärenden',
                            action: { 'type': 'navigate', 'value': 'UserEvents' },
                            icon: 'arrow-forward'
                        },
                    ]
                }
            },
            {
                Component: ChatDivider,
                componentProps: {
                    info: `Bokning ${form.name.toLowerCase()} avslutad`,
                }
            }
        ]);

        chat.switchAgent(props => <WatsonAgent {...props}
            initialMessages={['Kan jag hjälpa dig med någon annat?']}
        />)

        chat.switchInput({
            autoFocus: false,
            type: 'text',
            placeholder: 'Skriv något...'
        });
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
        try {
            const { chat } = this.props;
            const { WATSON_WORKSPACEID } = env;

            if (!WATSON_WORKSPACEID) {
                throw new Error('Missing Watson workspace ID');
            }

            const response = await sendChatMsg(WATSON_WORKSPACEID, message, context);

            // Default input
            let textInput = [{
                type: 'text',
                placeholder: 'Skriv något...',
                autoFocus: false,
            }];

            if (!response.data
                || !response.data.attributes
                || !response.data.attributes.output
                || !response.data.attributes.output.generic) {
                throw new Error('Something went wrong with Watson response');
            }

            const { output, context: newContext } = response.data.attributes;

            // Set new context
            context = newContext;

            await output.generic.reduce(async (previousPromise, current) => {
                await previousPromise;
                switch(current.response_type) {
                    case 'text':
                        return chat.addMessages({
                            Component: props => <ChatBubble {...props}>
                                <MarkdownConstructor rawText={current.text}/>
                            </ChatBubble>,
                            componentProps: {
                                content: current.text,
                                modifiers: ['automated'],
                            }
                        });

                    case 'option':
                        const options = current.options.map((option) => {
                            const meta = this.captureMetaData(option.value.input.text);

                            const { action } = meta;
                            // Add callback method to form action
                            if (action) {
                                action.callback = action.type === 'form' ? (params) => this.onFormEnd(params) : () => {};
                            }

                            return {
                                value: option.label,
                                ...meta,
                                action
                            };
                        });

                        const optionType = options[0].type;

                        if (optionType === 'chat') {
                            return chat.addMessages({
                                Component: (props) => <ButtonStack {...props} chat={chat} />,
                                componentProps: {
                                    items: options
                                }
                            });
                        }

                        // Disable default input
                        textInput = false;

                        return chat.switchInput([{
                            type: 'radio',
                            options: options,
                        }]);

                    case 'pause':
                        await chat.toggleTyping();
                        await new Promise(resolve => setTimeout(resolve, current.time));
                        return chat.toggleTyping();

                    default:
                        return Promise.resolve();
                }

            }, Promise.resolve());

            // Set default input
            if (textInput) {
                await chat.switchInput(textInput);
            }

        } catch(e) {
            console.info('Error in WatsonAgent::handleHumanChatMessage', e);
            await chat.addMessages({
                Component: ChatBubble,
                componentProps: {
                    content: 'Kan ej svara på frågan. Vänta och prova igen senare.',
                    modifiers: ['automated'],
                }
            });
        }
    };

    render() {
        return null;
    }
}
