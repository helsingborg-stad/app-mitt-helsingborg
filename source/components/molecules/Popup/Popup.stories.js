import React from 'react';
import { View } from 'react-native';
import { storiesOf } from '@storybook/react-native';
import styled from 'styled-components/native';
import StoryWrapper from '../StoryWrapper';
import Button from '../../atoms/Button/Button';
import Text from '../../atoms/Text';
import { usePopup } from '../../../store/NotificationContext';

const PopupContainer = styled.View`
  position: absolute;
  z-index: 1000;
  top: 33%;
  left: 10%;
  right: 10%;
  bottom: 0;
  padding: 0px;
  max-height: 50%;
  width: 80%;
  background-color: white;
  flex-direction: column;
  border-radius: 6px;
  shadow-offset: 0 0;
  shadow-opacity: 0.1;
  shadow-radius: 6px;
`;
const ContentContainer = styled.View`
  padding: 10px;
  flex-direction: column;
  justify-content: space-between;
  flex: 10;
`;
const TextWrapper = styled.View`
  margin-top: auto;
  margin-bottom: auto;
  margin-left: auto;
  margin-right: auto;
`;
const ButtonRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  padding: 12px;
`;

const NotificationButton = styled(Button)`
  margin-top: 24px;
  margin-left: 10px;
  margin-right: 10px;
`;

/** Passing a function that takes a function close is a way to access the contexts close notification function */
const ExamplePopup = close => (
  <PopupContainer>
    <ContentContainer>
      <TextWrapper>
        <Text type="h6">This is a simple popup!</Text>
      </TextWrapper>
      <ButtonRow>
        <Button small style={{ marginRight: 10 }}>
          <Text>Some button</Text>
        </Button>
        <Button colorSchema="red" onClick={close}>
          <Text>Close</Text>
        </Button>
      </ButtonRow>
    </ContentContainer>
  </PopupContainer>
);

const PopupExamples = () => {
  const showPopup = usePopup();
  return (
    <View>
      <NotificationButton
        color="green"
        block
        onClick={() => {
          showPopup(ExamplePopup);
        }}
      >
        <Text>Show popup</Text>
      </NotificationButton>
      <NotificationButton
        color="blue"
        block
        onClick={() => {
          showPopup(ExamplePopup, 5000);
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
