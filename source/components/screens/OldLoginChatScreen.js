import React, { Component } from 'react';
import { KeyboardAvoidingView, StyleSheet, SafeAreaView, View } from 'react-native';
import styled from 'styled-components/native';
import ChatComponentsContainer from '../organisms/ChatComponentsContainer';
import LoginInput from '../molecules/LoginInput';
import ChatHeader from '../molecules/ChatHeader';
import ScreenWrapper from '../molecules/ScreenWrapper';

class LoginChatScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      displayFormInput: false,
      messages: MESSAGES,
      actions: ACTIONS,
    };
  }

  addMessages = objects => {
    const { messages } = this.state;
    const newMessages = messages.concat(objects);
    this.setState({
      messages: newMessages,
    });
  };

  setActions = actions => {
    this.setState({
      actions,
    });
  };

  activateFormInput = value => {
    this.setState({
      displayFormInput: true,
    });
  };

  render() {
    const { messages, actions, displayFormInput } = this.state;

    return (
      <EnhancedScreenWrapper>
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
              {messages.length > 0 && (
                <ChatComponentsContainer
                  style={{
                    flexBasis: '100%',
                  }}
                  scrollEnabled
                  inverted
                  listObjects={messages}
                  setActions={this.setActions.bind(this)}
                  addMessages={this.addMessages.bind(this)}
                  activateFormInput={this.activateFormInput.bind(this)}
                />}

              {/* Actions */}
              {actions.length > 0 && (
                <ChatComponentsContainer
                  style={{
                    flexShrink: 0,
                    padding: 16,
                  }}
                  scrollEnabled={false}
                  inverted={false}
                  listObjects={actions}
                  setActions={this.setActions.bind(this)}
                  addMessages={this.addMessages.bind(this)}
                  activateFormInput={this.activateFormInput.bind(this)}
                />}

              {/* Input form */}
              {displayFormInput && <LoginInput />}
            </View>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </EnhancedScreenWrapper>
    );
  }
}

export default LoginChatScreen;

const EnhancedScreenWrapper = styled(ScreenWrapper)`
  padding: 0px;
`;

const MESSAGES = [
  {
    type: 'chatBubble',
    modifiers: ['automated'],
    value: 'Hej!',
  },
  {
    type: 'chatBubble',
    modifiers: ['automated'],
    value: 'Välkommen till Mitt Helsingborg!',
  },
  {
    type: 'chatBubble',
    modifiers: ['automated'],
    value: 'Jag heter Sally!',
  },
];

const ACTIONS = [
  {
    type: 'chatSectionTitle',
    value: 'Hur vill du fortsätta?',
  },
  {
    type: 'component',
    value: 'moreInfo',
  },
  {
    type: 'component',
    value: 'loginAction',
  },
];

const styles = StyleSheet.create({
  chatContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    paddingBottom: 0,
    backgroundColor: '#F5F5F5',
  },
  chatBody: {
    flex: 1,
  },
});
