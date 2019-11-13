import React, { Component } from 'react';
import { storiesOf } from '@storybook/react-native';

import StoryWrapper from '../../molecules/StoryWrapper';

import Chat from '../Chat';
import FormAgent from './';

import EventHandler, { EVENT_USER_MESSAGE } from '../../../helpers/EventHandler';

import ChatBubble from '../../atoms/ChatBubble';
import { getFormTemplate } from '../../../services/ChatFormService';

import {renameMatchedKeysInObject, excludePropetiesWithKey} from '../../../helpers/Objects'

class FormAgentInitiator extends Component {
    componentDidMount() {
        const { chat } = this.props;

        chat.addMessages({
            Component: ChatBubble,
            componentProps: {
                content: 'Hej! Vill du prova FormAgent?',
                modifiers: ['automated'],
            }
        });

        chat.switchInput({
            type: 'radio',
            options: [
                {
                    value: 'Ja, starta FormAgent nu!',
                },
            ],
        });

        EventHandler.subscribe(EVENT_USER_MESSAGE, (message) => this.handleMessage(message));
    }

    componentWillUnmount() {
        EventHandler.unSubscribe(EVENT_USER_MESSAGE);
    }

    handleMessage = (message) => {
        const { chat } = this.props;
        chat.switchAgent(props => (<FormAgent {...props} formId={1} />));
    };

    render() {
        return null;
    }
}

class FormAgentInitiatorWithRequest extends Component {

    state = {
        form: {}
    }

    async componentDidMount() {
        const { chat } = this.props;

        const formId = 1;
        const formQuestionsData = await getFormTemplate(formId);
        const formObject = this.convertFromJsonApiDataToFormObject(formQuestionsData);

        chat.addMessages({
            Component: ChatBubble,
            componentProps: {
                content: 'Hej! Vill du prova FormAgent?',
                modifiers: ['automated'],
            }
        });

        chat.switchInput({
            type: 'radio',
            options: [
                {
                    value: 'Ja, starta FormAgent nu!',
                },
            ],
        });

        EventHandler.subscribe(EVENT_USER_MESSAGE, (message) => this.handleMessage(message));

        this.setState({form: formObject})
    }

    convertFromJsonApiDataToFormObject = (jsonApiData) => {
        const {included, data} = jsonApiData

        const formDetails = included.find(obj => obj.type === "form");

        let formObject = {
            name: formDetails.attributes.name,
            id: formDetails.id,
            questions: this.createQuestionsArray(data, included)
        }

        return formObject
    }

    createQuestionsArray = (questions, included) => {
        questions = questions.map( item => {

            const {id, attributes, relationships} = item;

            let questionObject = renameMatchedKeysInObject(attributes, "question_");
            questionObject = excludePropetiesWithKey(attributes, ["form_id"]);

            questionObject.id = id

            if (relationships.options.data) {
                questionObject.options = item.relationships.options.data
                    .map( o =>   {
                            const relationshipData = included.find(x => x.type === o.type && x.id === o.id)
                            return ({
                              value: relationshipData.attributes.option_choice_name 
                            })
                        }
                    ).flat()
            }

            return questionObject
        })

        return questions;

    }

    componentWillUnmount() {
        EventHandler.unSubscribe(EVENT_USER_MESSAGE);
    }

    handleMessage = (message) => {
        const { chat } = this.props;
        const { form } = this.state
        chat.switchAgent(props => (<FormAgent {...props} form={form} formId={form.id} />));
    };

    render() {
        return null;
    }
}


storiesOf('Chat', module)
    .add('Form agent', () => (
        <StoryWrapper>
            <Chat ChatAgent={FormAgentInitiator} />
        </StoryWrapper>
    ))
    .add('Form agent with data from request', () => (
        <StoryWrapper>
            <Chat ChatAgent={FormAgentInitiatorWithRequest} />
        </StoryWrapper>
    ));
