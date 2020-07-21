import React, { useState } from 'react';
import { storiesOf } from '@storybook/react-native';
import GroupListWithAvatar from 'app/components/molecules/GroupedListWithAvatar';
import StoryWrapper from '../StoryWrapper';
import ListItem from './index';

const COAPPLICATION = require('source/images/illu_sammanstallning.png');

const heading = 'FAMILJ / PERSONER JAG DELAR BOENDE MED';
const GroupedAvatarListData = [
  {
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

const AvatarListStory = props => {
  const [answers, setAnswers] = useState([
    { firstName: 'Eva', lastName: 'Erikson', email: 'test@test.dev' },
  ]);
  const change = value => {
    setAnswers(value);
  };
  const [answersKids, setAnswersKids] = useState([{ firstName: 'Lotta', lastName: 'Erikson' }]);
  const changeKids = value => {
    setAnswersKids(value);
  };
  return (
    <StoryWrapper {...props} style={{ backgroundColor: '#FFAA9B' }}>
      <GroupListWithAvatar heading="VUXNA JAG DELAR BOENDE MED" value={answers} onChange={change} />
      <GroupListWithAvatar
        heading="BARN JAG DELAR BOENDE MED"
        value={answersKids}
        onChange={changeKids}
        formId="34c8e190-c68d-11ea-9984-cbb2e8b06538"
      />
    </StoryWrapper>
  );
};

storiesOf('Lists', module)
  .add('Highlight colors', props => (
    <StoryWrapper {...props}>
      {HighlightedData.map(item => (
        <ListItem highlighted key={item.id} {...item} />
      ))}
    </StoryWrapper>
  ))
  .add('Grouped list with avatars', props => <AvatarListStory />);
