import React from 'react';
import { storiesOf } from '@storybook/react-native';
import StoryWrapper from '../StoryWrapper';
import GroupedList from '../GroupedList/GroupedList';
import ListItem from './index';
import GroupListWithAvatar from 'app/components/molecules/GroupedListWithAvatar'

const GroupedListData = [
  {
    heading: 'TISDAG 3 NOVEMBER',
    data: [
      {
        id: 'bd7a8bea',
        title: 'Highlighted with icon',
        text: 'Lorem ipsum',
        iconName: 'directions-bus',
        highlighted: true,
        color: 'red',
      },
    ],
  },
  {
    heading: 'FREDAG 10 NOVEMBER',
    data: [
      {
        id: '3ac68afc',
        title: 'With icon',
        text: 'Lorem ipsum',
        iconName: 'directions-bus',
      },
      {
        id: '58694a0f',
        title: 'Default',
        text: 'Lorem ipsum',
      },
    ],
  },
];

const COAPPLICATION = require('source/images/illu_sammanstallning.png');

const GroupedAvatarListData = [
  {
    heading: 'FAMILJ / PERSONER JAG DELAR BOENDE MED',
    data: [
      {
        id: 'bd7a8bea',
        title: 'Lisa Larsson',
        text: 'Sambo',
        imageSrc: COAPPLICATION,
      },
      {
        id: 'bd7a8bea',
        title: 'Lotten Larsson',
        text: 'Barn',
        imageSrc: COAPPLICATION,
      }
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
  .add('Grouped list', props => (
    <StoryWrapper {...props}>
      <GroupedList heading="Avslutade" items={GroupedListData} />
    </StoryWrapper>
  ))
  .add('Highlight colors', props => (
    <StoryWrapper {...props}>
      {HighlightedData.map(item => (
        <ListItem highlighted key={item.id} {...item} />
      ))}
    </StoryWrapper>
  ))
  .add('Grouped list with avatars', props => (
    <StoryWrapper { ...props } style={{backgroundColor: '#FFAA9B'}}>
      <GroupListWithAvatar items={ GroupedAvatarListData } />
    </StoryWrapper>
  ));
