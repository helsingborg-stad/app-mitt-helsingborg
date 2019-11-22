import React, { Component } from 'react';
import { PropTypes } from 'prop-types';

import EventHandler, { EVENT_USER_MESSAGE } from '../../../helpers/EventHandler';
import forms from '../../../assets/forms.js';

import ChatBubble from '../../atoms/ChatBubble';

import ChatDivider from '../../atoms/ChatDivider';
import WatsonAgent from "../WatsonAgent";
import createExpression from '../../../helpers/Logics';

class FormAgentExperimental extends Component {
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
        
        // Retrive updated question queue.
        const newQueue = Array.from(this.updateQueue(queue, answers, questions, currentQuestion))

        // Retrive the first question in the queue.
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

        // Set currentQuestion and queue then output messages & render input
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
            // Return the queue untouched.
            return queue
        }

        
        if(currentQuestion) {
            const currentQueue = [...queue]

            if ("logics" in currentQuestion) {
                
                // Find the answer for the question that was just answered.
                const currentQuestionAnswer = answers[currentQuestion.id]

                // Go thourugh all the logic actions for a question. 
                currentQuestion.logics.actions.reduce((accumulator, action) => {

                    // Find the target question to add in the queue.
                    const questionToAddInQueue = questions.find(q => q.id === action.target_question)

                    if ('op' in action.condition) {
                        // Retrive predicate funtion to 
                        const checkAnswerWithExpression = createExpression(action.condition);
                        
                        // Check if the answer on the current question matches the condition/expression 
                        if(checkAnswerWithExpression(currentQuestionAnswer)){

                            // if answer matches the condition add the traget question to the queue.
                            return this.enqueue(currentQueue, questionToAddInQueue)
                        }

                        return;
                    }

                    // if current question does not have a condition add target question without checking the condition.
                    return this.enqueue(currentQueue, questionToAddInQueue)

                }, '')
            } else {
                // If the questions does not have any logic dependecy, 
                // find the next question to add based on the current question's postition.
                const questionToAddInQueue = questions.find(q => q.position === (currentQuestion.position + 1))
                this.enqueue(currentQueue, questionToAddInQueue)
            }

            // Return the queue with new questions.
            return currentQueue
        } else {
            // Return the queue untouched.
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

FormAgentExperimental.propTypes = {
    formId: PropTypes.string.isRequired,
    chat: PropTypes.shape({}).isRequired,
    answers: PropTypes.shape({}),
    startPosition: PropTypes.number,
}

FormAgentExperimental.defaultProps = {
    answers: {},
    startPosition: 1
}
export default FormAgentExperimental;
