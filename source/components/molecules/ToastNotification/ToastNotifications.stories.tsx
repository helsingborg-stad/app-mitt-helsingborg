import React from 'react';
import { View } from 'react-native';
import { storiesOf } from '@storybook/react-native';
import styled from 'styled-components/native';
import StoryWrapper from '../StoryWrapper';
import Button from '../../atoms/Button/Button';
import Text from '../../atoms/Text';
import { useNotification } from '../../../store/NotificationContext';

const NotificationButton = styled(Button)`
  margin-top: 24px;
`;

const NotificationsExample = () => {
  const showNotification = useNotification();
  return (
    <View>
      <NotificationButton
        colorSchema="green"
        block
        onClick={() => {
          showNotification('This is a success notification!', 'meep', 'success');
        }}
      >
        <Text>Show success notification</Text>
      </NotificationButton>
      <NotificationButton
        colorSchema="purple"
        block
        onClick={() => {
          showNotification('This is an info notification!', 'foo', 'info');
        }}
      >
        <Text>Show info notification</Text>
      </NotificationButton>
      <NotificationButton
        colorSchema="blue"
        block
        onClick={() => {
          showNotification(
            'This is a warning!',
            'it will stay only a very short time',
            'warning',
            1500
          );
        }}
      >
        <Text>Show warning notification</Text>
      </NotificationButton>
      <NotificationButton
        colorSchema="red"
        block
        onClick={() => {
          showNotification('This is an error notification!', 'It will stay for ever', 'error', 0);
        }}
      >
        <Text>Show error notification</Text>
      </NotificationButton>
      <NotificationButton
        colorSchema="neutral"
        block
        onClick={() => {
          showNotification('This is a notification', 'Message here!', 'neutral', 1500);
        }}
      >
        <Text>Show neutral notification</Text>
      </NotificationButton>
    </View>
  );
};

storiesOf('Notifications', module).add('default', () => (
  <StoryWrapper>
    <NotificationsExample />
  </StoryWrapper>
));
