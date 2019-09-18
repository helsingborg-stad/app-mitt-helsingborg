import React, { Component } from 'react';
import { KeyboardAvoidingView, StyleSheet, SafeAreaView, View } from 'react-native';
import { ChatComponentsContainer, LoginInput, ChatHeader } from '../Components';

class LoginChatScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            displayFormInput: false,
            messages: MESSAGES,
            actions: ACTIONS,
        };
    }

    addMessages = (objects) => {
        const { messages } = this.state;
        const newMessages = messages.concat(objects);
        this.setState({
            messages: newMessages
        });
    }

    setActions = (actions) => {
        this.setState({
            actions
        })
    }

    activateFormInput = (value) => {
        this.setState({
            displayFormInput: true
        })
    }

    render() {
        const { messages, actions, displayFormInput } = this.state;

        return (
            <SafeAreaView style={{ flex: 1 }}>
                <KeyboardAvoidingView
                    style={styles.chatContainer}
                    behavior="padding"
                    keyboardVerticalOffset={88} // TODO: remove hard coded offset
                    enabled
                >

                    <View style={styles.chatBody}>
                        {/* Header */}
                        <ChatHeader />

                        {/* Messages */}
                        {messages.length > 0 &&
                            <ChatComponentsContainer
                                style={{
                                    padding: 16,
                                }}
                                listObjects={messages}
                                setActions={this.setActions.bind(this)}
                                addMessages={this.addMessages.bind(this)}
                                activateFormInput={this.activateFormInput.bind(this)}
                            />
                        }

                        {/* Actions */}
                        {actions.length > 0 &&
                            <ChatComponentsContainer
                                style={{
                                    flexShrink: 0,
                                    padding: 16,
                                }}
                                listObjects={actions}
                                setActions={this.setActions.bind(this)}
                                addMessages={this.addMessages.bind(this)}
                                activateFormInput={this.activateFormInput.bind(this)}
                            />
                        }

                        {/* Input form */}
                        {displayFormInput &&
                            <LoginInput />
                        }
                    </View>
                </KeyboardAvoidingView>
            </SafeAreaView>
        );
    }
}

export default LoginChatScreen;

const MESSAGES = [
    {
        type: 'chatBubble',
        modifiers: ['automated'],
        value: "Hej!",
    },
    {
        type: 'chatBubble',
        modifiers: ['automated'],
        value: "Välkommen till Mitt Helsingborg!"
    },
    {
        type: 'chatBubble',
        modifiers: ['automated'],
        value: "Jag heter Sally!"
    },
]

const ACTIONS = [
    {
        type: 'chatSectionTitle',
        value: "Hur vill du fortsätta?"
    },
    {
        type: 'component',
        value: "moreInfo"
    },
    {
        type: 'component',
        value: "loginAction"
    },
]

const styles = StyleSheet.create({
    chatContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'stretch',
        paddingBottom: 0
    },
    chatBody: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    paper: {
        backgroundColor: '#fff',
        padding: 24,
        borderRadius: 7,
        shadowOpacity: 0.2,
        shadowRadius: 2,
        shadowColor: '#000',
        shadowOffset: { height: 5, width: 0 },
    },
    container: {
        flex: 1,
        alignItems: 'stretch',
        padding: 16,
    },
    content: {
        flex: 1,
    },
    loginContainer: {
        flex: 0,
        width: '100%',
        marginBottom: 30
    },
    loginFooter: {
        marginTop: 42,
        marginBottom: 26,
        alignItems: 'center',
    },
    button: {
        paddingTop: 16,
        paddingBottom: 16,
        backgroundColor: '#007AFF',
        borderRadius: 7,
    },
    buttonDisabled: {
        backgroundColor: '#E5E5EA',
    },
    buttonText: {
        fontSize: 18,
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    buttonTextDisabled: {
        color: '#C7C7CC',
    },
    infoText: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 24,
        marginBottom: 24
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
    },
    inputField: {
        height: 40,
        borderColor: 'transparent',
        borderBottomColor: '#D3D3D3',
        borderWidth: 0.5,
        marginBottom: 24,
        color: '#555',
    },
});


