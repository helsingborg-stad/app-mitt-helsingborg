/* eslint-disable camelcase */
import React, { Component } from 'react';
import env from 'react-native-config';
import { PropTypes } from 'prop-types';
import EventHandler, { EVENT_USER_MESSAGE } from '../../../helpers/EventHandler';
import { sendChatMsg } from '../../../services/ChatFormService';
import ChatBubble from '../../atoms/ChatBubble';
import ButtonStack from '../../molecules/ButtonStack';
import StorageService, {
  COMPLETED_FORMS_KEY,
  USER_KEY,
  SHOW_SPLASH_SCREEN,
} from '../../../services/StorageService';
import MarkdownConstructor from '../../../helpers/MarkdownConstructor';
import ChatDivider from '../../atoms/ChatDivider';

let context;
let sessionId;

class WatsonAgent extends Component {
  /**
   * Parse metadata found in text strings
   * @param {string} value
   */
  static captureMetaData(value) {
    if (typeof value !== 'string') {
      return {};
    }

    const match = /{([a-z0-9\s.,_'"-[\]:{}]+)}/g.exec(value);
    let meta = match && typeof match[1] !== 'undefined' ? match[1] : undefined;

    try {
      meta = JSON.parse(meta);
    } catch (error) {
      return {};
    }

    return meta;
  }

  componentDidMount() {
    const { chat, initialMessages } = this.props;

    if (initialMessages !== undefined && Array.isArray(initialMessages)) {
      initialMessages.forEach(message => {
        chat.addMessages({
          Component: ChatBubble,
          componentProps: {
            content: message,
            modifiers: ['automated'],
          },
        });
      });
    } else if (initialMessages !== undefined && initialMessages === 'remote') {
      // Show welcome message from Watson
      this.handleHumanChatMessage('');
    } else {
      chat.addMessages({
        Component: ChatBubble,
        componentProps: {
          content: `Hej och välkommen till Mitt Helsingborg! Jag heter Sally. Jag kan hjälpa dig med att svara på frågor och guida dig runt i appen.`,
          modifiers: ['automated'],
        },
      });

      chat.addMessages({
        Component: ChatBubble,
        componentProps: {
          content: 'Vad vill du göra?',
          modifiers: ['automated'],
        },
      });

      chat.addMessages({
        Component: props => <ButtonStack {...props} chat={chat} />,
        componentProps: {
          items: [
            {
              action: {
                type: 'form',
                value: 1,
              },
              value: 'Jag vill boka borgerlig vigsel',
              icon: 'favorite',
            },
            {
              action: {
                type: 'form',
                value: 2,
              },
              value: 'Jag vill ansöka om Ekonomiskt bistånd',
              icon: 'attach-money',
            },
            {
              value: 'Jag har frågor om borgerlig vigsel',
              icon: 'help-outline',
            },
          ],
        },
      });
    }

    EventHandler.subscribe(EVENT_USER_MESSAGE, message => this.handleHumanChatMessage(message));
  }

  componentWillUnmount() {
    EventHandler.unSubscribe(EVENT_USER_MESSAGE);
  }

  /**
   * Callback method that runs after form is done
   * @param {object}
   *
   * TODO: Move somewhere else in the future?
   */
  onFormEnd = async ({ form, answers }) => {
    const { chat } = this.props;

    const user = await StorageService.getData(USER_KEY);

    const formData = {
      id: +new Date(),
      userId: user.personalNumber,
      formId: form.id,
      created: new Date(),
      lastUpdated: new Date(),
      status: 'completed',
      data: answers,
    };

    try {
      await StorageService.addDataToArray(COMPLETED_FORMS_KEY, formData).then(() => {
        StorageService.getData(COMPLETED_FORMS_KEY).then(value => {
          this.updateActiveFormsBadge(value.length);
        });
      });
    } catch (error) {
      console.log('Save form error', error);
    }

    await chat.addMessages([
      {
        Component: props => <ButtonStack {...props} chat={chat} />,
        componentProps: {
          items: [
            {
              value: 'Visa mina ärenden',
              action: { type: 'navigate', value: 'UserEvents' },
              icon: 'arrow-forward',
            },
          ],
        },
      },
      {
        Component: ChatDivider,
        componentProps: {
          info: `Bokning ${form.name.toLowerCase()} avslutad`,
        },
      },
    ]);

    chat.switchAgent(props => (
      <WatsonAgent {...props} initialMessages={['Kan jag hjälpa dig med något annat?']} />
    ));

    chat.switchInput({
      autoFocus: false,
      type: 'text',
      placeholder: 'Skriv något...',
    });
  };

  handleHumanChatMessage = async message => {
    const { chat } = this.props;

    try {
      const { WATSON_ASSISTANT_ID } = env;

      if (!WATSON_ASSISTANT_ID) {
        throw new Error('Missing Watson assistant ID');
      }

      /**
       * TODO: FOR DEV PURPOSE ONLY, REMOVE ME LATER
       */
      if (message === 'Radera data') {
        await StorageService.removeData(COMPLETED_FORMS_KEY);
        await StorageService.removeData(SHOW_SPLASH_SCREEN);
        this.updateActiveFormsBadge(0);
        return chat.addMessages({
          Component: props => (
            <ChatBubble {...props}>
              <MarkdownConstructor rawText="Nu har jag raderat din data." />
            </ChatBubble>
          ),
          componentProps: {
            content: 'Nu har jag raderat din data.',
            modifiers: ['automated'],
          },
        });
      }

      const response = await sendChatMsg(WATSON_ASSISTANT_ID, message, context, sessionId);

      // Default input
      let textInput = [
        {
          type: 'text',
          placeholder: 'Skriv något...',
          autoFocus: false,
        },
      ];

      if (
        !response.data ||
        !response.data.attributes ||
        !response.data.attributes.output ||
        !response.data.attributes.output.generic
      ) {
        throw new Error('Something went wrong with Watson response');
      }

      const { output, context: newContext, session_id } = response.data.attributes;

      // Set new context and session ID
      context = newContext;
      sessionId = session_id;

      await output.generic.reduce(async (previousPromise, current) => {
        await previousPromise;
        switch (current.response_type) {
          case 'text':
            return chat.addMessages({
              Component: props => (
                <ChatBubble {...props}>
                  <MarkdownConstructor rawText={current.text} />
                </ChatBubble>
              ),
              componentProps: {
                content: current.text,
                modifiers: ['automated'],
              },
            });

          case 'option': {
            const options = current.options.map(option => {
              const meta = WatsonAgent.captureMetaData(option.value.input.text);

              const { action } = meta;
              // Add callback method to form action
              if (action) {
                action.callback =
                  action.type === 'form' ? props => this.onFormEnd(props) : () => {};
              }

              return {
                value: option.label,
                ...meta,
                action,
              };
            });

            const optionType = options[0].type;

            if (optionType === 'chat') {
              return chat.addMessages({
                Component: props => <ButtonStack {...props} chat={chat} />,
                componentProps: {
                  items: options,
                },
              });
            }

            // Disable default input
            textInput = false;

            return chat.switchInput([
              {
                type: 'radio',
                options,
              },
            ]);
          }

          case 'pause':
            await chat.toggleTyping();
            await new Promise(resolve => setTimeout(resolve, current.time));
            return chat.toggleTyping();

          default:
            return Promise.resolve();
        }
      }, Promise.resolve());

      // Set default input
      if (textInput) {
        await chat.switchInput(textInput);
      }
    } catch (e) {
      console.info('Error in WatsonAgent::handleHumanChatMessage', e);
      await chat.addMessages({
        Component: ChatBubble,
        componentProps: {
          content: 'Kan ej svara på frågan. Vänta och prova igen senare.',
          modifiers: ['automated'],
        },
      });
    }
  };

  updateActiveFormsBadge(newValue) {
    const { chat } = this.props;
    chat.setBadgeCount(newValue);
  }

  render() {
    return null;
  }
}

WatsonAgent.propTypes = {
  chat: PropTypes.shape({
    switchInput: PropTypes.func.isRequired,
    addMessages: PropTypes.func.isRequired,
    toggleTyping: PropTypes.func.isRequired,
    switchUserInput: PropTypes.func.isRequired,
    setBadgeCount: PropTypes.func.isRequired,
    switchAgent: PropTypes.func.isRequired,
  }),
  initialMessages: PropTypes.any,
};

export default WatsonAgent;
