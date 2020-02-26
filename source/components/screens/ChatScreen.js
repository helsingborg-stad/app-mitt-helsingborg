/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/prop-types */
import React, { Component } from 'react';
import styled from 'styled-components/native';
import ScreenWrapper from '../molecules/ScreenWrapper';
import Chat from '../organisms/Chat/Chat';
import withChatForm from '../organisms/withForm/withChatForm';
import WatsonAgent from '../organisms/Watson/WatsonAgent';

class ChatScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    tabBarVisible: navigation.state.params.tabBarVisible,
  });

  toggleTabs = () => {
    const { navigation } = this.props;
    navigation.setParams({
      tabBarVisible: navigation.getParam('tabBarVisible') !== true,
    });
  };

  render() {
    return (
      <ChatScreenWrapper>
        <Chat
          ChatAgent={props => <WatsonAgent {...props} initialMessages="remote" />}
          inputComponents={{ type: 'text', placeholder: 'Skriv något...', autoFocus: false }}
          // onUserLogin={this.toggleTabs} />)}
          ChatUserInput={false}
          keyboardVerticalOffset={0}
        />
      </ChatScreenWrapper>
    );
  }
}

const ChatScreenWrapper = styled(ScreenWrapper)`
  padding-top: 0px;
  padding-left: 0;
  padding-right: 0;
  padding-bottom: 0px;
`;

export default ChatScreen;
