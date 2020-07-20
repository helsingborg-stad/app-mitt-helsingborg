import React from 'react';
import { storiesOf } from '@storybook/react-native';
import { Text } from 'source/components/atoms';
import StoryWrapper from '../StoryWrapper';
import GroupedList from './GroupedList';

const categories = {
  fruit: 'Frukter',
  vegetable: 'Grönsaker',
};

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
    <GroupedList
      heading="Green things"
      items={items}
      categories={categories}
      removeItem={() => {}}
      color="light"
    />

    <GroupedList
      heading="Non-removable greens"
      items={items}
      categories={categories}
      removeItem={() => {}}
      color="light"
      removable={false}
    />
  </StoryWrapper>
));
