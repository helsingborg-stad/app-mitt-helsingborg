import React from 'react';
import { storiesOf } from '@storybook/react-native';
import StoryWrapper from '../../molecules/StoryWrapper';
import FormList from './FormList';

const FormListStory = () => <FormList onClickCallback={id => console.log('form id:', id)} />;

storiesOf('Form List', module).add('default', props => (
  <StoryWrapper {...props}>
    <FormListStory />
  </StoryWrapper>
));
