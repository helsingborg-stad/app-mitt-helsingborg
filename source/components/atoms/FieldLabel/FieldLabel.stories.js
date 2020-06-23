import { storiesOf } from '@storybook/react-native';
import React from 'react';
import styled from 'styled-components/native';
import FieldLabel from './FieldLabel';
import StoryWrapper from '../../molecules/StoryWrapper';

storiesOf('Field Label', module).add('default', () => (
  <StoryWrapper>
    <FieldLabel size="small">Small label!</FieldLabel>
    <FieldLabel>Normal Label!</FieldLabel>
    <FieldLabel size="large">Large label!</FieldLabel>
    
    <FieldLabel size="small" underline="true">Small label!</FieldLabel>
    <FieldLabel underline="true">Normal Label!</FieldLabel>
    <FieldLabel size="large" underline="true">Large label!</FieldLabel>

  </StoryWrapper>
));
