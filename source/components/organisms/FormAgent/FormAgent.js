import React, { Component } from 'react';

import { MONTHS } from '../../../helpers/Date';

import EventHandler, { EVENT_USER_MESSAGE } from '../../../helpers/EventHandler';
import forms from '../../../assets/forms.js';

import ChatBubble from '../../atoms/ChatBubble';

import ChatDivider from '../../atoms/ChatDivider';
import WatsonAgent from "../WatsonAgent";
import withChatForm from "../withChatForm";
import ChatForm from "../../molecules/ChatFormDeprecated";

class FormAgent extends Component {
    state = {
        form: {},
        questions: [],
        answers: {},
        currentQuestion: undefined,
    };

    componentDidMount() {
        const { formId, chat, answers } = this.props;

        chat.switchInput(false);

        const form = this.props.form ? this.props.form : forms.find(form => (form.id === formId));

        if (!form) {
            console.error(`FormAgent: Cannot find Form with ID ${formId}.`);
            return;
        }

        EventHandler.subscribe(EVENT_USER_MESSAGE, this.handleUserInput);

        chat.addMessages([
            {
                Component: ChatDivider,
                componentProps: {
                    title: '',
                    info: `Bokning ${form.name.toLowerCase()} startad`,
                }
            }
        ]);

        // Let the form party begin
        new Promise(resolve => setTimeout(resolve, 500)).then(() => {
            this.setState({
                answers: answers ? answers : {},
                form: form,
                questions: form.questions
            }, this.nextQuestion);
        });
    }

    componentWillUnmount() {
        EventHandler.unSubscribe(EVENT_USER_MESSAGE);
    }

    nextQuestion = async () => {
        const { chat } = this.props;
        const { questions, form, answers } = this.state;

        const nextQuestion = questions.find(this.isNextQuestion);

        if (!nextQuestion) {
            this.setState({ currentQuestion: undefined });

            await chat.addMessages([
                {
                    Component: ChatDivider,
                    componentProps: {
                        info: `Bokning ${form.name.toLowerCase()} avslutad`,
                    }
                }
            ]);

            chat.switchAgent(props => <WatsonAgent {...props}
                initialMessages={['Kan jag hjälpa dig med någon annat?']} />)

            chat.switchInput({
                autoFocus: false,
                type: 'text',
                placeholder: 'Skriv något...'
            });

            return;
        }

        // Set currentQuestion then output messages & render input
        this.setState({ currentQuestion: nextQuestion.id }, async () => {
            if (nextQuestion.name) {

                await this.outputMessages(
                    nextQuestion.name,
                    'automated',
                    nextQuestion.explainer
                );

                await new Promise(resolve => setTimeout(resolve, 50));

                if (nextQuestion.type === 'message') {
                    this.handleUserInput(false);
                    return;
                }

                chat.switchInput(nextQuestion);

                return
            }

            chat.switchInput(nextQuestion);
        });
    };

    isNextQuestion = question => {
        const { answers } = this.state;
        const { dependency, id } = question;

        let coniditionsIsValid = true;

        if (dependency && dependency.conditions && dependency.conditions.length > 0) {
            // Valdate conditions with 'AND' ... 'OR' has yet to be implemented
            coniditionsIsValid = dependency.conditions.reduce((accumulator, condition) => {
                if (!accumulator) {
                    return accumulator;
                }

                return answers[condition.key] !== undefined && answers[condition.key] === condition.value;
            }, true);
        }

        return coniditionsIsValid && answers[id] === undefined;
    };

    outputMessages = async (messages, modifier = 'automated', explainer = undefined) => {
        const { chat } = this.props;
        const arrayOfmessages = Array.isArray(messages)
            ? messages
            : [messages];


        await chat.toggleTyping();

        await arrayOfmessages.reduce(async (previousPromise, msg, index) => {
            await previousPromise;


            const message = typeof msg === 'function' ? msg(this.state) : msg;
            const caluclatedDelay = message.length * 16 + ((index + 1) * 400);
            const minDelayMs = 600; // 0.6 sec
            const maxDelayMs = 1000 * 2; // 2sec

            const delay = caluclatedDelay > maxDelayMs ? maxDelayMs : caluclatedDelay;

            let messageExplainer = undefined;


            await new Promise(resolve => setTimeout(resolve, delay >= minDelayMs ? delay : minDelayMs));

            // Map explainer with the message
            if (typeof explainer === 'object') {
                let foundExplainer = explainer.filter(({ key }) => key === index);
                foundExplainer = typeof foundExplainer[0] !== 'undefined'
                    ? foundExplainer[0] : {};

                messageExplainer = {
                    heading: foundExplainer.heading || undefined,
                    content: foundExplainer.content || undefined
                }
            }

            return chat.addMessages({
                Component: ChatBubble,
                componentProps: {
                    content: message,
                    modifiers: [modifier],
                    explainer: messageExplainer,
                }
            });
        }, Promise.resolve()).catch(e => { console.log(e); });

        await chat.toggleTyping();
    };

    handleUserInput = async message => {
        const { chat } = this.props;
        const { currentQuestion, answers } = this.state;

        if (currentQuestion) {
            await chat.switchUserInput(false);
            await new Promise(resolve => setTimeout(resolve, 500));
            await this.setState({ answers: { ...answers, [currentQuestion]: message } }, this.nextQuestion);
        }
    };

    render() {
        return null;
    }
}

export default FormAgent;

