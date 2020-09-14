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
        color="green"
        block
        onClick={() => {
          showNotification('This is a success notification!', 'meep', 'success');
        }}
      >
        <Text>Show success notification</Text>
      </NotificationButton>
      <NotificationButton
        color="purple"
        block
        onClick={() => {
          showNotification('This is an info notification!', 'foo', 'info');
        }}
      >
        <Text>Show info notification</Text>
      </NotificationButton>
      <NotificationButton
        color="blue"
        block
        onClick={() => {
          showNotification('This is a warning!', 'bar', 'warning');
        }}
      >
        <Text>Show warning notification</Text>
      </NotificationButton>
      <NotificationButton
        color="red"
        block
        onClick={() => {
          showNotification('This is an error notification!', 'Something went wrong!', 'error');
        }}
      >
        <Text>Show error notification</Text>
      </NotificationButton>
    </View>
  );
};

storiesOf('Notifications', module).add('default', () => (
  <StoryWrapper>
    <NotificationsExample />
  </StoryWrapper>
));
