import React, { Component } from 'react';
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
class ModalExample extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modal: {
        visible: false,
        heading: '',
        content: '',
        closeButtonText: '',
      },
    };
  }

  changeModal(visible, heading = '', content = '', closeButtonText = 'Klar') {
    this.setState({
      modal: {
        visible,
        heading,
        content,
        closeButtonText,
      },
    });
  }

  render() {
    const { modal } = this.state;
    const { visible, heading, closeButtonText } = modal;

    return (
      <View>
        <Modal
          color="purple"
          visible={visible}
          heading={heading}
          closeButtonText={closeButtonText}
          changeModal={isVisible => this.changeModal(isVisible)}
        >
          <Text>Trying out children</Text>
          <Button onClick={() => this.changeModal(!visible)}>
            <Text>En knapp</Text>
          </Button>
        </Modal>

        <ModalButton
          color="purple"
          onClick={() =>
            this.changeModal(
              !visible,
              'Modal one',
              'Donec ullamcorper nulla non metus auctor fringilla. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Sed posuere consectetur est at lobortis. Donec ullamcorper nulla non metus auctor fringilla. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ullamcorper nulla non metus auctor fringilla. \n\nSociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Integer posuere erat a ante venenatis dapibus posuere velit aliquet. Aenean lacinia bibendum nulla sed consectetur. Donec ullamcorper nulla non metus auctor fringilla. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. \n\nSociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Integer posuere erat a ante venenatis dapibus posuere velit aliquet. Aenean lacinia bibendum nulla sed consectetur. Donec ullamcorper nulla non metus auctor fringilla. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.  \n\nSociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Integer posuere erat a ante venenatis dapibus posuere velit aliquet. Aenean lacinia bibendum nulla sed consectetur. Donec ullamcorper nulla non metus auctor fringilla. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing.'
            )
          }
        >
          <Text>Show modal</Text>
        </ModalButton>

        <ModalButton
          color="blue"
          onClick={() =>
            this.changeModal(
              !visible,
              'Modal two',
              'Donec ullamcorper nulla non metus auctor fringilla. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Sed posuere consectetur est at lobortis. Donec ullamcorper nulla non metus auctor fringilla. Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
            )
          }
        >
          <Text>Show modal</Text>
        </ModalButton>

        <ModalButton
          color="dark"
          onClick={() =>
            this.changeModal(
              !visible,
              'Markdown modal',
              `[I'm an inline-style link](https://www.google.com)`
            )
          }
        >
          <Text>Show modal</Text>
        </ModalButton>
      </View>
    );
  }
}

storiesOf('Modal 2', module).add('default', () => (
  <StoryWrapper>
    <ModalExample />
  </StoryWrapper>
));
