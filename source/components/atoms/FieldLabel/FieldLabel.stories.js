import { storiesOf } from '@storybook/react-native';
import React from 'react';
import styled from 'styled-components/native';
import FieldLabel from './FieldLabel';
import StoryWrapper from '../../molecules/StoryWrapper';
import theme from '../../../styles/theme';

const Background = styled.View`
  background-color: ${theme.background.darker};
`;

storiesOf('Field Label', module).add('default', () => (
  <StoryWrapper>
    <FieldLabel size="small">Small light label</FieldLabel>
    <FieldLabel color="red" size="small" underline={false}>
      Small red label without line
    </FieldLabel>
    <FieldLabel color="green">Normal green Label</FieldLabel>
    <FieldLabel color="orange">Normal orange Label</FieldLabel>
    <FieldLabel size="large">Large label</FieldLabel>
    <Background>
      <FieldLabel color="blue">Normal blue Label</FieldLabel>
      <FieldLabel color="dark" size="large">
        Large dark label
      </FieldLabel>
    </Background>
  </StoryWrapper>
));
