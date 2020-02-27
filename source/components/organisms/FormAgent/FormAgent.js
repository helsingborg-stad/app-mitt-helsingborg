import React, { Component } from 'react';
import validator from 'validator';
import PropTypes from 'prop-types';
import EventHandler, { EVENT_USER_MESSAGE } from '../../../helpers/EventHandler';
import forms from '../../../assets/mock/forms.js';
import ChatBubble from '../../atoms/ChatBubble';
import ChatDivider from '../../atoms/ChatDivider/ChatDivider';
import StorageService, { USER_KEY } from '../../../services/StorageService';
import MarkdownConstructor from '../../../helpers/MarkdownConstructor';

// TODO: Find better place for storing this function and
// TODO: Refactor function so it can be used in a more general purpose.
const questionValidation = (value, validations) => {
  const validationRulesResults = validations.map(rule => {
    const args = rule.args || [];

    const validationMethod = typeof rule.method === 'string' ? validator[rule.method] : rule.method;

    let validationValue = value;

    if (Array.isArray(value)) {
      validationValue = `${value.length}`;
    }

    return {
      isValid: validationMethod(validationValue, ...args) === rule.valid_when,
      message: rule.message || '',
    };
  });

  const inValidValidationRules = validationRulesResults.filter(v => v.isValid === false);

  if (inValidValidationRules.length > 0) {
    return inValidValidationRules[0];
  }

  return { isValid: true, message: '' };
};

class FormAgent extends Component {
  state = {
    form: {},
    questions: [],
    answers: {},
    currentQuestion: undefined,
    user: {},
  };

  componentDidMount() {
    const { formId, chat, answers, form } = this.props;

    this.saveUserToState();

    chat.switchInput(false);

    const formObject = form || forms.find(formItem => formItem.id === formId);

    if (!formObject) {
      console.error(`FormAgent: Cannot find Form with ID ${formId}.`);
      return;
    }

    EventHandler.subscribe(EVENT_USER_MESSAGE, this.handleUserInput);

    chat.addMessages([
      {
        Component: ChatDivider,
        componentProps: {
          title: '',
          info: `Bokning ${formObject.name.toLowerCase()} startad`,
        },
      },
    ]);

    // Let the form party begin
    new Promise(resolve => setTimeout(resolve, 500)).then(() => {
      this.setState(
        {
          answers: answers || {},
          form: formObject,
          questions: formObject.questions,
        },
        this.nextQuestion
      );
    });
  }

  componentWillUnmount() {
    EventHandler.unSubscribe(EVENT_USER_MESSAGE);
  }

  nextQuestion = async () => {
    const { chat, callback } = this.props;
    const { form, questions, answers } = this.state;

    const nextQuestion = questions.find(this.isNextQuestion);

    if (!nextQuestion) {
      this.setState({ currentQuestion: undefined });
      if (typeof callback === 'function') {
        callback({ form, answers });
      }
      return;
    }

    if (nextQuestion.validations) {
      nextQuestion.withForm = {
        ...nextQuestion.withForm,
        validateSubmitHandlerInput: value => questionValidation(value, nextQuestion.validations),
      };
    }

    // Set currentQuestion then output messages & render input
    this.setState({ currentQuestion: nextQuestion.id }, async () => {
      if (nextQuestion.name) {
        await this.outputMessages(nextQuestion.name, 'automated', nextQuestion.explainer);

        await new Promise(resolve => setTimeout(resolve, 50));

        if (nextQuestion.type === 'message') {
          this.handleUserInput(false);
          return;
        }

        chat.switchInput(nextQuestion);

        return;
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
    const arrayOfmessages = Array.isArray(messages) ? messages : [messages];

    await chat.toggleTyping();

    await arrayOfmessages
      .reduce(async (previousPromise, msg, index) => {
        await previousPromise;

        const message = typeof msg === 'function' ? msg(this.state) : msg;
        const caluclatedDelay = message.length * 16 + (index + 1) * 400;
        const minDelayMs = 600; // 0.6 sec
        const maxDelayMs = 1000 * 2; // 2sec

        const delay = caluclatedDelay > maxDelayMs ? maxDelayMs : caluclatedDelay;

        let messageExplainer;

        await new Promise(resolve => setTimeout(resolve, delay >= minDelayMs ? delay : minDelayMs));

        // Map explainer with the message
        if (typeof explainer === 'object') {
          let foundExplainer = explainer.filter(({ key }) => key === index);
          foundExplainer = typeof foundExplainer[0] !== 'undefined' ? foundExplainer[0] : {};

          messageExplainer = {
            heading: foundExplainer.heading || undefined,
            content: foundExplainer.content || undefined,
          };
        }

        return chat.addMessages({
          Component: props => (
            <ChatBubble {...props}>
              <MarkdownConstructor rawText={message} />
            </ChatBubble>
          ),
          componentProps: {
            content: message,
            modifiers: [modifier],
            explainer: messageExplainer,
          },
        });
      }, Promise.resolve())
      .catch(e => {
        console.log(e);
      });

    await chat.toggleTyping();
  };

  handleUserInput = async message => {
    const { chat } = this.props;
    const { currentQuestion, answers } = this.state;

    if (currentQuestion) {
      await chat.switchUserInput(false);
      await new Promise(resolve => setTimeout(resolve, 500));
      await this.setState(
        { answers: { ...answers, [currentQuestion]: message } },
        this.nextQuestion
      );
    }
  };

  saveUserToState = async () => {
    const user = await StorageService.getData(USER_KEY);
    if (user) {
      this.setState({ user });
    }
  };

  render() {
    return null;
  }
}

FormAgent.propTypes = {
  formId: PropTypes.number,
  chat: PropTypes.shape({
    switchInput: PropTypes.func.isRequired,
    addMessages: PropTypes.func.isRequired,
    toggleTyping: PropTypes.func.isRequired,
    switchUserInput: PropTypes.func.isRequired,
  }),
  answers: PropTypes.object,
  form: PropTypes.object,
  callback: PropTypes.func,
};

export default FormAgent;
