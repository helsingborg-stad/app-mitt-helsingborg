import React, { Component } from 'react';
import env from 'react-native-config';

import EventHandler, { EVENT_USER_MESSAGE } from '../../../helpers/EventHandler';

import ChatBubble from '../../atoms/ChatBubble';
import { getFormTemplate } from '../../../services/ChatFormService';
import withAuthentication from '../withAuthentication';

class FormAgent extends Component {
    state = {
        questions: [],
        activeQuestion: undefined,
    };

    componentDidMount() {
        const { chat } = this.props;
        this.setFormQuestionsToState()
        chat.addMessages({
            Component: ChatBubble,
            componentProps: {
                content: 'Låt oss börja med några frågor.',
                modifiers: ['automated'],
            }
        });

        EventHandler.subscribe(EVENT_USER_MESSAGE, (message) => this.handleUserInput(message, this.state));
    }

    componentWillUnmount() {
        EventHandler.unSubscribe(EVENT_USER_MESSAGE);
    }

    setFormQuestionsToState = async () => {
        const { formId } = this.props
        if (this.state.questions.length === 0) {
            const apiResponse  = await getFormTemplate(formId);
            this.setState({questions: apiResponse.data.attributes.questions})
        }
    }

    getNextQuestion = (questions, activeQuestion) => {
        if (activeQuestion === undefined) {
            return  questions[0]
        }

        const currentQuestionIndex = questions.indexOf(activeQuestion);
        const questionIndex = currentQuestionIndex + 1
        const question = questions[questionIndex]

        return question
    }

    handleUserInput = async (message, state) => {
        this.setState((state, props) => {
            const {chat} = props
            const { questions, activeQuestion } = state;

            const question = this.getNextQuestion(questions, activeQuestion)
            if (questions.indexOf(question) == state.questions.length -1){
                chat.addMessages({
                    Component: ChatBubble,
                    componentProps: {
                        content: "The end, bye bye.",
                        modifiers: ['automated'],
                    }
                });

                return state;
            } else {
                chat.addMessages({
                    Component: ChatBubble,
                    componentProps: {
                        content: question.question_name,
                        modifiers: ['automated'],
                    }
                });
    
                return { ...state, activeQuestion: question };
            }

        })
    };

    render() {
        return null;
    }
}

export default FormAgent;