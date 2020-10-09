import React from 'react';
import { storiesOf } from '@storybook/react-native';
import StoryWrapper from '../StoryWrapper';
import FormFieldGroup from './FormFieldGroup';
import FormField from '../FormField';

const formFieldGroupStories = storiesOf('Form Field Group');

formFieldGroupStories.add('Default', () => (
  <StoryWrapper>
    <FormFieldGroup>
      <FormField />
      <FormField />
    </FormFieldGroup>
  </StoryWrapper>
));

formFieldGroupStories.add('Named Group', () => (
  <StoryWrapper>
    <FormFieldGroup name="Named Form Field Group">
      <FormField />
      <FormField />
    </FormFieldGroup>
  </StoryWrapper>
));
formFieldGroupStories.add('Multiple Groups', () => (
  <StoryWrapper>
    <FormFieldGroup name="Named group">
      <FormField />
      <FormField />
      <FormField />
    </FormFieldGroup>

    <FormFieldGroup>
      <FormField />
    </FormFieldGroup>

    <FormFieldGroup name="Another named group">
      <FormField />
      <FormField />
    </FormFieldGroup>
  </StoryWrapper>
));
