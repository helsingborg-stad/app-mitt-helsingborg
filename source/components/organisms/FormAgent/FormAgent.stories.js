/* eslint-disable no-unused-vars */
/* eslint-disable max-classes-per-file */
import PropTypes from 'prop-types';
import { storiesOf } from '@storybook/react-native';
import React, { Component } from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import FormAgent from '.';
import EventHandler, { EVENT_USER_MESSAGE } from '../../../helpers/EventHandler';
import { excludePropetiesWithKey, renameMatchedKeysInObject } from '../../../helpers/Objects';
import { getFormTemplate } from '../../../services/ChatFormService';
import ChatBubble from '../../atoms/ChatBubble';
import StoryWrapper from '../../molecules/StoryWrapper';
import Chat from '../Chat/Chat';
import FormAgentExperimental from './FormAgentExperimental';

class FormAgentInitiator extends Component {
  componentDidMount() {
    const { chat } = this.props;

    chat.addMessages({
      Component: ChatBubble,
      componentProps: {
        content: 'Hej! Vill du prova FormAgent?',
        modifiers: ['automated'],
      },
    });

    chat.switchInput({
      type: 'radio',
      options: [
        {
          value: 'Ja, starta FormAgent nu!',
        },
      ],
    });

    EventHandler.subscribe(EVENT_USER_MESSAGE, message => this.handleMessage(message));
  }

  componentWillUnmount() {
    EventHandler.unSubscribe(EVENT_USER_MESSAGE);
  }

  handleMessage = message => {
    const { chat } = this.props;
    chat.switchAgent(props => <FormAgent {...props} formId={1} />);
  };

  render() {
    return null;
  }
}

FormAgentInitiator.propTypes = {
  chat: PropTypes.shape({
    switchInput: PropTypes.func.isRequired,
    switchAgent: PropTypes.func.isRequired,
    addMessages: PropTypes.func.isRequired,
  }),
};

class FormAgentExperimentalInitiator extends Component {
  componentDidMount() {
    const { chat } = this.props;

    chat.addMessages({
      Component: ChatBubble,
      componentProps: {
        content: 'Hej! Vill du prova FormAgent?',
        modifiers: ['automated'],
      },
    });

    chat.switchInput({
      type: 'radio',
      options: [
        {
          value: 'Ja, starta FormAgent nu!',
        },
      ],
    });

    EventHandler.subscribe(EVENT_USER_MESSAGE, message => this.handleMessage(message));
  }

  componentWillUnmount() {
    EventHandler.unSubscribe(EVENT_USER_MESSAGE);
  }

  handleMessage = message => {
    const { chat } = this.props;
    chat.switchAgent(props => <FormAgentExperimental {...props} formId={1} />);
  };

  render() {
    return null;
  }
}

FormAgentExperimentalInitiator.propTypes = {
  chat: PropTypes.shape({
    switchInput: PropTypes.func.isRequired,
    switchAgent: PropTypes.func.isRequired,
    addMessages: PropTypes.func.isRequired,
  }),
};

class FormAgentInitiatorWithRequest extends Component {
  state = {
    form: {},
  };

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
      },
    });

    chat.switchInput({
      type: 'radio',
      options: [
        {
          value: 'Ja, starta FormAgent nu!',
        },
      ],
    });

    EventHandler.subscribe(EVENT_USER_MESSAGE, message => this.handleMessage(message));

    this.setState({ form: formObject });
  }

  componentWillUnmount() {
    EventHandler.unSubscribe(EVENT_USER_MESSAGE);
  }

  convertFromJsonApiDataToFormObject = jsonApiData => {
    const { included, data } = jsonApiData;

    const formDetails = included.find(obj => obj.type === 'form');

    const formObject = {
      name: formDetails.attributes.name,
      id: formDetails.id,
      questions: this.createQuestionsArray(data, included),
    };

    return formObject;
  };

  createQuestionsArray = (questions, included) => {
    const newQuestions = questions.map(item => {
      const { id, attributes, relationships } = item;

      let questionObject = renameMatchedKeysInObject(attributes, 'question_');
      questionObject = excludePropetiesWithKey(attributes, ['form_id']);

      questionObject.id = id;

      if (relationships.options.data) {
        questionObject.options = item.relationships.options.data
          .map(o => {
            const relationshipData = included.find(x => x.type === o.type && x.id === o.id);
            return {
              value: relationshipData.attributes.option_choice_name,
            };
          })
          .flat();
      }

      return questionObject;
    });

    return newQuestions;
  };

  handleMessage = _message => {
    const { chat } = this.props;
    const { form } = this.state;
    chat.switchAgent(props => <FormAgent {...props} form={form} formId={form.id} />);
  };

  render() {
    return null;
  }
}

FormAgentInitiatorWithRequest.propTypes = {
  chat: PropTypes.shape({
    switchInput: PropTypes.func.isRequired,
    switchAgent: PropTypes.func.isRequired,
    addMessages: PropTypes.func.isRequired,
  }),
};

const StoryStack = createSwitchNavigator(
  {
    Story: () => (
      <StoryWrapper>
        <Chat ChatAgent={FormAgentInitiator} />
      </StoryWrapper>
    ),
  },
  {
    initialRouteName: 'Story',
  }
);

const StoryNavigator = createAppContainer(StoryStack);

storiesOf('Chat', module).add('Form agent', () => <StoryNavigator />);

// .add('Form agent with data from request', () => (
//   <StoryWrapper>
//     <Chat ChatAgent={FormAgentInitiatorWithRequest} />
//   </StoryWrapper>
// ))
// .add('Experimental form agent', () => (
//   <StoryWrapper>
//     <Chat ChatAgent={FormAgentExperimentalInitiator} />
//   </StoryWrapper>
// ));
