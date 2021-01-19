import { storiesOf } from '@storybook/react-native';
import React from 'react';
import StoryWrapper from '../StoryWrapper';
import InfoModal from './InfoModal';
import { Button, Label, Text } from '../../atoms';
import { useModal } from '../Modal';
import userAgreementText from '../../../assets/text/userAgreementText';

const InfoModals = () => {
  const [visible1, toggleModal1] = useModal();
  const [visible2, toggleModal2] = useModal();
  return [
    <Label>Show a simple modal with markdown</Label>,
    <Button onClick={toggleModal1}>
      <Text>Open Info Modal</Text>
    </Button>,
    <InfoModal
      visible={visible1}
      toggleModal={toggleModal1}
      heading="Behandling av användaruppgifter"
      markdownText={userAgreementText}
      buttonText="Close"
    />,
    <Label>Modal with short text</Label>,
    <Button onClick={toggleModal2}>
      <Text>Open Info Modal</Text>
    </Button>,
    <InfoModal
      visible={visible2}
      toggleModal={toggleModal2}
      heading="Short text"
      markdownText="Hello, world!"
      buttonText="Close"
    />,
  ];
};

storiesOf('Info Modal', module).add('Default', (props) => (
  <StoryWrapper {...props} style={{ marginLeft: 30 }}>
    <InfoModals />
  </StoryWrapper>
));
