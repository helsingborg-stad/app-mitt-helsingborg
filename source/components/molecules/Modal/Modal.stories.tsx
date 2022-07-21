import React from 'react';
import { View } from 'react-native';
import { storiesOf } from '@storybook/react-native';
import styled from 'styled-components/native';
import { Modal, useModal } from './';
import StoryWrapper from '../StoryWrapper';
import Button from '../../atoms/Button/Button';
import Text from '../../atoms/Text';

const ModalButton = styled(Button)`
  margin-top: 24px;
`;

const ModalExample = () => {
  const [visible, toggleModal] = useModal();

  return (
    <View>
      <Modal color="purple" visible={visible} hide={toggleModal}>
        <Text>Children 1</Text>
        <Text>Children 2</Text>
        <Button onClick={toggleModal}>
          <Text>Close</Text>
        </Button>
      </Modal>

      <ModalButton color="purple" onClick={toggleModal}>
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
