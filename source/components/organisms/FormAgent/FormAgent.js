import React, { Component } from 'react';

import { MONTHS } from '../../../helpers/Date';

import EventHandler, { EVENT_USER_MESSAGE } from '../../../helpers/EventHandler';
import forms from '../../../assets/forms.js';

import ChatBubble from '../../atoms/ChatBubble';

import ChatDivider from '../../atoms/ChatDivider';

class FormAgent extends Component {
    state = {
        form: {},
        questions: [],
        answers: {},
        currentQuestion: undefined,
    };

    componentDidMount() {
        const { formId, chat, answers } = this.props;

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
                title: `${new Date().getDay()} ${MONTHS.SE[new Date().getMonth()]}`,
                info: form.name,
              }
            }
        ]);

        // Let the form party begin
        this.setState({
            answers: answers ? answers : {}, 
            form: form, 
            questions: form.questions
        }, this.nextQuestion);   
    }

    componentWillUnmount() {
        EventHandler.unSubscribe(EVENT_USER_MESSAGE);
    }
    
    nextQuestion = () => {
        const { chat } = this.props;
        const { questions, form, answers } = this.state;

        const nextQuestion = questions.find(this.isNextQuestion);

        if (!nextQuestion) {
            this.setState({currentQuestion: undefined});

            if (form.doneMessage) {
                this.outputMessages(form.doneMessage);
            }
            
            return;
        }

        // Set currentQuestion then output messages & render input
        this.setState({currentQuestion: nextQuestion.key}, () => {
            this.outputMessages(nextQuestion.question);
            chat.switchInput(nextQuestion.input);
        });
    }

    isNextQuestion = question => {
        const { answers } = this.state;
        const { dependency } = question;

        let isValid = true;

        if (dependency && dependency.conditions && dependency.conditions.length > 0) {
            // Valdate conditions with 'AND' ... 'OR' has yet to be implemented
            isValid = dependency.conditions.reduce((accumulator, condition) => {
                if (!accumulator) {
                    return accumulator;
                }
                
                return answers[condition.key] !== undefined && answers[condition.key] === condition.value;
            }, true);
        }

        return isValid && answers[question.key] === undefined;
    }

    outputMessages = (messages, modifier = 'automated') => {
        const { chat } = this.props;
        const arrayOfmessages = Array.isArray(messages) 
        ? messages
        : [messages];
        
        arrayOfmessages.forEach(message => {
            chat.addMessages({
                Component: ChatBubble,
                componentProps: {
                    content: typeof message === 'function' ? message(this.state) : message,
                    modifiers: [modifier],
                }
            });
        });
    }

    handleUserInput = message => {
        const { chat } = this.props;
        const { currentQuestion, answers } = this.state;

        if (currentQuestion) {
            chat.switchUserInput(false);
            this.setState({answers: {...answers, [currentQuestion]: message}}, this.nextQuestion);
        }
    };

    render() {
        return null;
    }
}

export default FormAgent;
