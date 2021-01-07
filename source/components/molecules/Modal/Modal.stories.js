import React, { Component, useState } from 'react';
import { View } from 'react-native';
import { storiesOf } from '@storybook/react-native';
import styled from 'styled-components/native';
import StoryWrapper from '../StoryWrapper';
import Modal from './Modal';
import Button from '../../atoms/Button/Button';
import Text from '../../atoms/Text';

const ModalButton = styled(Button)`
  margin-top: 24px;
`;
const ModalExample = () => {
  const [visible, setVisible] = useState(false);

  return (
    <View>
      <Modal color="purple" visible={visible} setVisibility={(isVisible) => setVisible(isVisible)}>
        <Text>Children 1</Text>
        <Text>Children 2</Text>
        <Button onClick={() => setVisible(false)}>
          <Text>Close</Text>
        </Button>
      </Modal>

      <ModalButton color="purple" onClick={() => setVisible(true)}>
        <Text>Show modal</Text>
      </ModalButton>
    </View>
  );
};

storiesOf('Modal', module).add('default', () => (
  <StoryWrapper>
    <ModalExample />
  </StoryWrapper>
));
