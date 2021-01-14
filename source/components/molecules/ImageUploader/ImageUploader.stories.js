import { storiesOf } from '@storybook/react-native';
import React from 'react';
import StoryWrapper from '../StoryWrapper';
import ImageUploader from './ImageUploader';
import { Label } from '../../atoms';

storiesOf('ImageUploader2', module).add('Default', (props) => (
  <StoryWrapper {...props} style={{ marginLeft: 30 }}>
    <Label>Neutral</Label>
    <ImageUploader colorSchema="neutral" buttonText="Ladda upp bilder" />

    <Label>Blue</Label>
    <ImageUploader colorSchema="blue" buttonText="Ladda upp bilder" />

    <Label>Purple</Label>
    <ImageUploader colorSchema="purple" buttonText="Ladda upp bilder" />

    <Label>Purple</Label>
    <ImageUploader colorSchema="red" buttonText="Ladda upp bilder" />

    <Label>Green</Label>
    <ImageUploader colorSchema="green" buttonText="Ladda upp bilder" />
  </StoryWrapper>
));
