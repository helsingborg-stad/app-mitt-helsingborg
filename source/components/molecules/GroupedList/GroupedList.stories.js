import React from 'react';
import { storiesOf } from '@storybook/react-native';
import { Text } from 'source/components/atoms';
import StoryWrapper from '../StoryWrapper';
import GroupedList from './GroupedList';

const categories = [
  {
    category: 'Frukter',
  },
  { category: 'Grönsaker' },
];

const items = [
  {
    category: 'fruit',
    component: <Text>Banana!</Text>,
  },
  {
    category: 'fruit',
    component: <Text>Pear!</Text>,
  },
  {
    category: 'vegetable',
    component: <Text>Carrot!</Text>,
  },
];

storiesOf('Lists 2', module).add('Grouped list', props => (
  <StoryWrapper {...props}>
    <GroupedList heading="Green things" items={items} categories={categories} color="light" />

    <GroupedList
      heading="Red color scheme"
      items={items}
      categories={categories}
      color="red"
      onEdit={() => {}}
    />
  </StoryWrapper>
));
