import React from 'react';
import { storiesOf } from '@storybook/react-native';
import GroupListWithAvatar from 'app/components/molecules/GroupedListWithAvatar';
import StoryWrapper from '../StoryWrapper';
import ListItem from './index';

const COAPPLICATION = require('source/images/illu_sammanstallning.png');

const GroupedAvatarListData = [
  {
    heading: 'FAMILJ / PERSONER JAG DELAR BOENDE MED',
    data: [
      {
        id: 'bd7a8bea',
        title: 'Malin Larsson',
        text: 'Sambo',
        imageSrc: COAPPLICATION,
      },
      {
        id: 'bd7a8bea',
        title: 'Lotten Larsson',
        text: 'Barn',
        imageSrc: COAPPLICATION,
      },
    ],
  },
];

const HighlightedData = [
  {
    id: 'bd7a2be9',
    title: 'Default',
    text: 'Default',
    iconName: 'wc',
  },
  {
    id: 'bd7acbea',
    title: 'Blue',
    text: 'Lorem ipsum',
    iconName: 'wc',
    color: 'blue',
  },
  {
    id: 'bd7acbe3',
    title: 'Green',
    text: 'Lorem ipsum',
    iconName: 'wc',
    color: 'green',
  },
  {
    id: 'bd7acbe5',
    title: 'Purple',
    text: 'Lorem ipsum',
    iconName: 'wc',
    color: 'purple',
  },
  {
    id: 'bd7a6be2',
    title: 'Red',
    text: 'Lorem ipsum',
    iconName: 'wc',
    color: 'red',
  },
];

storiesOf('Lists', module)
  .add('Highlight colors', props => (
    <StoryWrapper {...props}>
      {HighlightedData.map(item => (
        <ListItem highlighted key={item.id} {...item} />
      ))}
    </StoryWrapper>
  ))
  .add('Grouped list with avatars', props => (
    <StoryWrapper {...props} style={{ backgroundColor: '#FFAA9B' }}>
      <GroupListWithAvatar items={GroupedAvatarListData} />
    </StoryWrapper>
  ));
