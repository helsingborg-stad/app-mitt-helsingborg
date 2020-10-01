import { storiesOf } from '@storybook/react-native';
import React from 'react';
import StoryWrapper from '../StoryWrapper';
import ImageUploader from './ImageUploader';

storiesOf('ImageUploader', module).add('Default, max 3 images', props => (
  <StoryWrapper {...props}>
    <ImageUploader heading="Ladda upp bilder" maxImages={3} />
  </StoryWrapper>
));
