import React from 'react';
import { storiesOf } from '@storybook/react-native';
import StoryWrapper from '../../components/molecules/StoryWrapper';
import Button from '../../components/atoms/Button';
import Text from '../../components/atoms/Text';

storiesOf('Error boundary', module).add('Default', () => (
  <StoryWrapper>
    <Button
      onClick={() => {
        throw new Error('This is an JS error, handle me!');
      }}
      block
      variant="outlined"
      colorSchema="red"
      pill
    >
      <Text>Trigger JS error</Text>
    </Button>
  </StoryWrapper>
));
