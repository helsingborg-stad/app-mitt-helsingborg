import { Component } from 'react';
import env from 'react-native-config';
import EventHandler, { EVENT_USER_MESSAGE } from '../../helpers/EventHandler';
import { sendChatMsg } from '../../services/ChatFormService';
import ChatBubble from '../atoms/ChatBubble';
import { Alert } from "react-native";
import FormAgent from "./FormAgent";

let firstRun = true;
let conversationId;

export default class WatsonAgent extends Component {
    state = {
        disableAgent: false
    };

    componentDidMount() {

        console.log('Watson');
        const { chat } = this.props;
        chat.addMessages({
            Component: ChatBubble,
            componentProps: {
                content: 'Hej mitt namn är Watson.',
                modifiers: ['automated'],
            }
        });
        EventHandler.subscribe(EVENT_USER_MESSAGE, (message) => this.handleHumanChatMessage(message));
    }
    componentWillUnmount() {
        EventHandler.unSubscribe(EVENT_USER_MESSAGE);
    }
    handleHumanChatMessage = async (message) => {
        const { chat } = this.props;
        const workspaceId = env.WATSON_WORKSPACEID;
        if (workspaceId === undefined) {
            Alert.alert('Missing Watson workspace ID');
        }
        else {
            let responseText;
            try {
                await sendChatMsg(workspaceId, message, conversationId).then((response) => {
                    const responseGeneric = response.data.attributes.output.generic;

                    if (firstRun) {
                        conversationId = response.data.attributes.context.conversation_id;

                        firstRun = false;
                    }

                    responseGeneric.forEach(elem => {
                        if (elem.response_type === 'text') {
                            responseText = elem.text;

                            if (responseText.indexOf('[agent:forms]') !== -1) {
                                this.setState({disableAgent: true});
                                chat.switchAgent(FormAgent, {formId: 1});
                            }
                        }
                    });
                });
            }
            catch (e) {
                console.log('SendChat error: ', e);
                responseText = 'Kan ej svara på frågan. Vänta och prova igen senare.';
            }

            if (!this.state.disableAgent) {
                chat.addMessages({
                    Component: ChatBubble,
                    componentProps: {
                        content: responseText,
                        modifiers: ['automated'],
                    }
                });
            }
        }
    };
    render() {
        return null;
    }
}
