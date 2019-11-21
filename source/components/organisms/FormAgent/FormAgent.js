import React, { Component } from 'react';

import { MONTHS } from '../../../helpers/Date';

import EventHandler, { EVENT_USER_MESSAGE } from '../../../helpers/EventHandler';
import forms from '../../../assets/forms.js';

import ChatBubble from '../../atoms/ChatBubble';

import ChatDivider from '../../atoms/ChatDivider';
import WatsonAgent from "../WatsonAgent";
import withChatForm from "../withChatForm";
import ChatForm from "../../molecules/ChatFormDeprecated";
import createExpression from '../../../helpers/Logics';
import { PropTypes } from 'prop-types';

class FormAgent extends Component {
    state = {
        form: {},
        answers: {},
        questions: [],
        queue: [],
        currentQuestion: undefined,
        position: undefined,
    };

    componentDidMount() {
        const { formId, chat, answers, startPosition } = this.props;

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

        const currentQuestion = form.questions.find(q => q.position=== startPosition)
        const initialQueue = [ currentQuestion ]

        // Let the form party begin
        new Promise(resolve => setTimeout(resolve, 500)).then(() => {
            this.setState({
                answers: answers,
                form: form,
                questions: form.questions,
                queue: initialQueue,
            }, this.nextQuestion);
        });
    }

    componentWillUnmount() {
        EventHandler.unSubscribe(EVENT_USER_MESSAGE);
    }

    nextQuestion = async () => {
        const { chat } = this.props;
        const { questions, form, answers, queue, currentQuestion } = this.state;
        
        const newQueue = Array.from(this.updateQueue(queue, answers, questions, currentQuestion))

        const nextQuestionFromQueue = this.dequeue(newQueue)

        if (!nextQuestionFromQueue) {
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
        this.setState({queue: newQueue, currentQuestion: nextQuestionFromQueue }, async () => {
            if (nextQuestionFromQueue.name) {

                await this.outputMessages(
                    nextQuestionFromQueue.name,
                    'automated',
                    nextQuestionFromQueue.explainer,
                );

                await new Promise(resolve => setTimeout(resolve, 50));

                if (nextQuestionFromQueue.type === 'message') {
                    this.handleUserInput(false);
                    return;
                }

                chat.switchInput(nextQuestionFromQueue);

                return
            }

            chat.switchInput(nextQuestionFromQueue);
        });
    };

    updateQueue = (queue, answers, questions, currentQuestion) => {
        // updated the queue based on the answer for the current question.
        if(queue.length > 0 || currentQuestion.last) {
           return queue
        }

        if(currentQuestion) {
            const currentQueue = [...queue]

            if ("logics" in currentQuestion) {
                
                const currentQuestionAnswer = answers[currentQuestion.id]

                currentQuestion.logics.actions.reduce((accumulator, action) => {

                    const questionToAddInQueue = questions.find(q => q.id === action.target_question)

                    if ('op' in action.condition) {
                        const checkAnswerWithExpression = createExpression(action.condition);
                        
                        if(checkAnswerWithExpression(currentQuestionAnswer)){
                            return this.enqueue(currentQueue, questionToAddInQueue)
                        }

                        return;
                    }

                    return this.enqueue(currentQueue, questionToAddInQueue)

                }, '')
            } else {
                const questionToAddInQueue = questions.find(q => q.position === (currentQuestion.position + 1))
                this.enqueue(currentQueue, questionToAddInQueue)
            }

            return currentQueue
        } else {
            return queue
        }
    }


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

    dequeue = (queue) => {
        // removing element from the queue 
        // returns undefined when called  
        // on empty queue 
        if(this.queueIsEmpty(queue))
            return undefined;
        return queue.shift();
    }

    enqueue = (queue, item) => {
        // adding element to the queue 
        queue.push(item);
    }

    queueIsEmpty = (queue) => { 
        // return true if the queue is empty. 
        return queue.length == 0;
    } 

    handleUserInput = async message => {
        const { chat } = this.props;
        const { currentQuestion, answers } = this.state;

        if (currentQuestion) {
            await chat.switchUserInput(false);
            await new Promise(resolve => setTimeout(resolve, 500));
            await this.setState({ answers: { ...answers, [currentQuestion.id]: message } }, this.nextQuestion);
        }
    };

    render() {
        return null;
    }
}

FormAgent.propTypes = {
    formId: PropTypes.string.isRequired,
    chat: PropTypes.shape({}).isRequired,
    answers: PropTypes.shape({}),
    startPosition: PropTypes.number,
}

FormAgent.defaultProps = {
    answers: {},
    startPosition: 1
}
export default FormAgent;
