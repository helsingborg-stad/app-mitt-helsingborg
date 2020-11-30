import React from 'react';
import { View } from 'react-native';
import { storiesOf } from '@storybook/react-native';
import styled from 'styled-components/native';
import StoryWrapper from '../StoryWrapper';
import Button from '../../atoms/Button/Button';
import Text from '../../atoms/Text';
import { usePopup } from '../../../store/NotificationContext';

const NotificationButton = styled(Button)`
  margin-top: 24px;
  margin-left: 15px;
  margin-right: 15px;
`;

const ExamplePopup = () => (
  <View>
    <Text>This is a simple popup!</Text>
    <Button>This does nothing!</Button>
  </View>
);

const PopupExamples = () => {
  const showPopup = usePopup();
  return (
    <View>
      <NotificationButton
        color="green"
        block
        onClick={() => {
          showPopup(ExamplePopup());
        }}
      >
        <Text>Show success notification</Text>
      </NotificationButton>
      <NotificationButton
        color="blue"
        block
        onClick={() => {
          showPopup(ExamplePopup(), 1500);
        }}
      >
        <Text>Show popup that disappears after a short time</Text>
      </NotificationButton>
    </View>
  );
};

storiesOf('Popups', module).add('default', () => (
  <StoryWrapper>
    <PopupExamples />
  </StoryWrapper>
));
