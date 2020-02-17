import React, { Component } from 'react';
import styled from 'styled-components/native';
import ScreenWrapper from '../molecules/ScreenWrapper';
import Chat from '../organisms/Chat';
import LoginAgent from '../organisms/LoginAgent';
import withChatForm from '../organisms/withChatForm';
import ChatForm from '../molecules/ChatFormDeprecated';

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
          ChatAgent={props => <LoginAgent {...props} onUserLogin={this.toggleTabs} />}
          ChatUserInput={false}
        />
      </ChatScreenWrapper>
    );
  }
}

const ChatScreenWrapper = styled(ScreenWrapper)`
  padding-left: 0;
  padding-right: 0;
`;

export default ChatScreen;
