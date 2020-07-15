import React from 'react';
import { storiesOf } from '@storybook/react-native';
import GroupListWithAvatar from 'app/components/molecules/GroupedListWithAvatar';
import { Text } from 'source/components/atoms';
import StoryWrapper from '../../molecules/StoryWrapper';
import SubstepList from './SubstepList';

const heading = 'Green things';

const categories = {
  fruit: 'Frukter',
  vegetable: 'Grönsaker',
};

const items = [
  {
    category: 'fruit',
    component: <Text>Banana!</Text>,
    title: 'Banana',
    formId: 'e366f250-c5a2-11ea-9e21-b7b32d0793c5',
  },
  {
    category: 'fruit',
    component: <Text>Pear!</Text>,
    title: 'Pear',
    formId: 'e366f250-c5a2-11ea-9e21-b7b32d0793c5',
  },
  {
    category: 'vegetable',
    component: <Text>Carrot!</Text>,
    title: 'Carrot',
    formId: 'e366f250-c5a2-11ea-9e21-b7b32d0793c5',
  },
];

storiesOf('Substep List', module).add('default', props => (
  <StoryWrapper {...props}>
    <SubstepList heading={heading} items={items} categories={categories} value={{}} />
  </StoryWrapper>
));
