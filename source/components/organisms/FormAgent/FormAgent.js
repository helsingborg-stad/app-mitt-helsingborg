import { Component } from 'react';

import EventHandler, { EVENT_USER_MESSAGE } from '../../../helpers/EventHandler';

import ChatBubble from '../../atoms/ChatBubble';

import withChatController from '../withChatController';
import { getFormTemplate } from '../../../services/ChatFormService';

const convertToArray = (value)  => {
    const array = Array.isArray(value) ? value : [value];
    return array
}
class FormAgent extends Component {
    state = {
        questions: [],
        answers: {},
        currentQuestion: undefined,
    };

    async componentDidMount() {
        const { formId } = this.props;

        // Setting state from api request
        const formQuestions = await getFormTemplate(formId)
        const validations = formQuestions.included.filter(i => i.type === "validation");
        const options = formQuestions.included.filter(i => i.type === "option");
        const questions = formQuestions.data.map(data => ({
            id: data.id,
            ...data.attributes, 
            validations: data.relationships.validations.data,
            options: data.relationships.options.data,
        }))

        EventHandler.subscribe(EVENT_USER_MESSAGE, this.handleUserInput);

        this.setState({questions, validations, options}, this.nextQuestion);   
    }

    componentWillUnmount() {
        EventHandler.unSubscribe(EVENT_USER_MESSAGE);
    }

    getOutputQuestions = (currentQuestion, questions) => {
        const currentQuestionIndex = questions.indexOf(currentQuestion)
        const nextQuestionInArray = questions[currentQuestionIndex + 1]
        
        let questionsToRender = [nextQuestionInArray];

        if (!nextQuestionInArray){
            return {nextInputQuestion: undefined, questionsToRender: []};
        }

        if (nextQuestionInArray.question_type === 'info') {
            const questionIndex = questions.indexOf(nextQuestionInArray);
            questionsToRender.push(questions[questionIndex + 1])
        }

        const nextInputQuestion = questionsToRender[questionsToRender.length - 1]
        return {nextInputQuestion, questionsToRender}
    }

    getOptionsForQuestion = (question, options) => {
        if (!question.options) { return undefined }

        // retrives realted options for a question from options state.
        const questionOptions = question.options.map(questionOption => 
            options.filter(option => option.id === questionOption.id)
        )

        // concats array of arrays [[obj], [obj]] to array of objects [obj, obj].
        const arrayOfOptionObjects = [].concat.apply([], questionOptions);

        return arrayOfOptionObjects
    }
    
    nextQuestion = () => {
        const { chat } = this.props;
        const { currentQuestion, questions, options } = this.state;
        const { nextInputQuestion, questionsToRender } = this.getOutputQuestions(currentQuestion, questions)

        if (!nextInputQuestion) {
            chat.switchUserInput(false);
            
            return;
        }

        this.setState({currentQuestion: nextInputQuestion}, () => {
            questionsToRender.forEach(question => {
                chat.addMessages({
                    Component: ChatBubble,
                    componentProps: {
                        content: question.question_name,
                        modifiers: ['automated'],
                    }
                });
            });
        
            const questionOptions = this.getOptionsForQuestion(nextInputQuestion, options);

            chat.switchInput([this.createInputObject(nextInputQuestion.question_type, "Test placeholder", questionOptions )]);
        });
    }

    createInputObject = (type, placeholder, options) => {
        let inputObject = {type, placeholder}

        if (options) {
            inputObject.options = options.map(o => ({value: o.attributes.option_choice_name}))
        }

        return inputObject
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
