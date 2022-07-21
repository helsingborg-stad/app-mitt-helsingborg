import { storiesOf } from '@storybook/react-native';
import React from 'react';
import styled from 'styled-components/native';
import FieldLabel from './Label';
import StoryWrapper from '../../molecules/StoryWrapper';
import theme from '../../../styles/theme';

const Background = styled.View`
  background-color: ${theme.background.darker};
`;

storiesOf('Field Label', module).add('default', () => (
  <StoryWrapper>
    <FieldLabel size="small" help={{ text: 'Some help text' }}>
      Small light label
    </FieldLabel>
    <FieldLabel color="red" size="small" underline={false} help={{ text: 'Some help text' }}>
      Small red label without line
    </FieldLabel>
    <FieldLabel color="green">Normal green Label</FieldLabel>
    <FieldLabel color="orange" help={{ text: 'Some help text' }}>
      Normal orange Label
    </FieldLabel>
    <FieldLabel size="large" help={{ text: 'Some help text' }}>
      Large label
    </FieldLabel>
    <Background>
      <FieldLabel color="blue">Normal blue Label</FieldLabel>
      <FieldLabel color="dark" size="large" help={{ text: 'Some help text' }}>
        Large dark label
      </FieldLabel>
    </Background>
  </StoryWrapper>
));
