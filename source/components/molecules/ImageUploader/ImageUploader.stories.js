import { storiesOf } from '@storybook/react-native';
import React from 'react';
import StoryWrapper from '../StoryWrapper';
import ImageUploader from './ImageUploader';

storiesOf('ImageUploader', module).add('Default', (props) => (
  <StoryWrapper {...props}>
    <ImageUploader buttonText="Ladda upp bilder" />
  </StoryWrapper>
));
