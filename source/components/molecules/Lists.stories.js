import React from 'react';
import { storiesOf } from '@storybook/react-native';
import StoryWrapper from './StoryWrapper';
import GroupedList from './GroupedList';
import ListItem from './ListItem';

storiesOf('Lists', module)
    .add('Grouped list', props => (
        <StoryWrapper {...props}>
            <GroupedList
                heading="Avslutade"
                items={GroupedListData}
            />
        </StoryWrapper>
    ))
    .add('Highlight colors', props => (
        <StoryWrapper {...props}>
            {HighlightedData.map(item =>
                <ListItem key={item.id} {...item} />
            )}
        </StoryWrapper>
    ))

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
            }
        ]
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
            }
        ]
    },
];

const HighlightedData = [
    {
        id: 'bd7a2be9',
        title: 'Default',
        text: 'Default',
        iconName: 'wc',
        highlighted: true,
    },
    {
        id: 'bd7acbea',
        title: 'Blue',
        text: 'Lorem ipsum',
        iconName: 'wc',
        highlighted: true,
        color: 'blue'
    },
    {
        id: 'bd7acbe3',
        title: 'Green',
        text: 'Lorem ipsum',
        iconName: 'wc',
        highlighted: true,
        color: 'green'
    },
    {
        id: 'bd7acbe5',
        title: 'Purple',
        text: 'Lorem ipsum',
        iconName: 'wc',
        highlighted: true,
        color: 'purple'
    },
    {
        id: 'bd7a6be2',
        title: 'Red',
        text: 'Lorem ipsum',
        iconName: 'wc',
        highlighted: true,
        color: 'red'
    },
];
