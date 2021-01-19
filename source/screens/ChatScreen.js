import React from 'react';
import styled from 'styled-components/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, ScreenWrapper } from '../components/molecules';

const ChatScreenWrapper = styled(ScreenWrapper)`
  padding: 16px;
  flex: 1;
`;

const ChatScreen = () => (
  <ChatScreenWrapper>
    <SafeAreaView>
      <Card colorSchema="green">
        <Card.Body outlined>
          <Card.Title>Hej!</Card.Title>
          <Card.Text>Exempelmeddelande här.</Card.Text>
        </Card.Body>
      </Card>
    </SafeAreaView>
  </ChatScreenWrapper>
);

export default ChatScreen;
