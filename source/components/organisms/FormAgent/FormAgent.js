import React, { Component } from 'react';

import EventHandler, { EVENT_USER_MESSAGE } from '../../../helpers/EventHandler';
import forms from '../../../assets/forms.js';

import ChatBubble from '../../atoms/ChatBubble';

import withChatController from '../withChatController';
import ChatDivider from '../../atoms/ChatDivider';

class FormAgent extends Component {
    state = {
        formName: '',
        questions: [],
        answers: {},
        currentQuestion: undefined,
    };

    componentDidMount() {
        const { formId, chat } = this.props;
        const form = forms.find(form => (form.id === formId));

        if (!form) {
            console.error(`FormAgent: Cannot find Form with ID ${formId}.`);
            return;
        }

        EventHandler.subscribe(EVENT_USER_MESSAGE, this.handleUserInput);

        let months = {};
        months[9] = "Oktober";
        months[10] = "November";

        chat.addMessages([
            {
              Component: ChatDivider,
              componentProps: {
                title: `${new Date().getDay()} ${months[new Date().getMonth()]}`,
                info: form.name,
              }
            }
        ]);

        // Let the form party begin
        this.setState({questions: form.questions, formName: form.name}, this.nextQuestion);   
    }

    componentWillUnmount() {
        EventHandler.unSubscribe(EVENT_USER_MESSAGE);
    }
    
    nextQuestion = () => {
        const { chat } = this.props;
        const { questions, answers } = this.state;

        const nextQuestion = questions.find(question => typeof answers[question.key] === 'undefined');

        if (!nextQuestion) {
            chat.switchUserInput(false);
            
            return;
        }

        this.setState({currentQuestion: nextQuestion.key}, () => {
            const messages = Array.isArray(nextQuestion.question) 
            ? nextQuestion.question 
            : [nextQuestion.question];

            messages.forEach(message => {
                chat.addMessages({
                    Component: ChatBubble,
                    componentProps: {
                        content: typeof message === 'function' ? message(this.state) : message,
                        modifiers: ['automated'],
                    }
                });
            });

            chat.switchInput(nextQuestion.input);
        });
    }

    handleUserInput = message => {
        this.setState(prevState => {
            const { currentQuestion } = prevState;
            let { answers } = prevState;
            
            if (!currentQuestion) {
                return prevState;
            }

            answers[currentQuestion] = message;

            return { answers };
        }, this.nextQuestion);
    };

    render() {
        return null;
    }
}

export default withChatController(FormAgent);