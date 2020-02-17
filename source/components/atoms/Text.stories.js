/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { storiesOf } from '@storybook/react-native';
import StoryWrapper from '../molecules/StoryWrapper';
import Text from './Text';

storiesOf('Text', module).add('default', () => (
  <StoryWrapper>
    <Text>
      Etiam porta sem malesuada magna mollis euismod. Morbi leo risus, porta ac consectetur ac,
      vestibulum at eros. Donec sed odio dui. Morbi leo risus, porta ac consectetur ac, vestibulum
      at eros. Etiam porta sem malesuada magna mollis euismod. Fusce dapibus, tellus ac cursus
      commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Curabitur
      blandit tempus porttitor.
    </Text>
  </StoryWrapper>
));
