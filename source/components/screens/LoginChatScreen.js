import React, { Component } from 'react';
import { KeyboardAvoidingView, StyleSheet, SafeAreaView } from 'react-native';
import MessageContainer from '../login/MessageContainer';
import ActionContainer from '../login/ActionContainer';

const MESSAGES = [
    {
        type: 'string',
        size: 'xl',
        value: "Hej!",
    },
    {
        type: 'string',
        size: 'lg',
        value: "Välkommen till Mitt Helsingborg!"
    },
    {
        type: 'string',
        size: 'lg',
        value: "Jag heter Sally!"
    },
]

const ACTIONS = [
    {
        type: 'separator',
        size: 'sm',
        value: "Hur vill du fortsätta?"
    },
    {
        type: 'component',
        size: 'md',
        value: "moreInfo"
    },
    {
        type: 'component',
        size: 'md',
        value: "login"
    },
]

class LoginChatScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            messages: MESSAGES,
            actions: ACTIONS,
        };
    }

    addMessages = (objects) => {
        this.setState({
            messages: this.state.messages.concat(objects)
        })
    }

    setActions = (actions) => {
        this.setState({
            actions
        })
    }

    render() {
        const { messages, actions } = this.state;

        return (
            <SafeAreaView style={{ flex: 1 }}>
                <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
                    <MessageContainer listObjects={messages} />
                    <ActionContainer
                        listObjects={actions}
                        setActions={this.setActions.bind(this)}
                        addMessages={this.addMessages.bind(this)}
                    />
                </KeyboardAvoidingView>
            </SafeAreaView>
        );
    }
}

export default LoginChatScreen;

const styles = StyleSheet.create({
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


