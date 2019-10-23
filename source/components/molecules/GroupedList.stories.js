import React from 'react';
import { storiesOf } from '@storybook/react-native';
import StoryWrapper from './StoryWrapper';
import GroupedList from './GroupedList';

storiesOf('Grouped list', module)
    .add('Default', props => (
        <StoryWrapper {...props}>
            <GroupedList
                heading="Avslutade"
                items={COMPLETED_TASKS}
            />
        </StoryWrapper>
    ))

const COMPLETED_TASKS = [
    {
        heading: 'TISDAG 3 NOVEMBER',
        data: [
            {
                id: 'bd7acbea',
                title: 'Skolskjuts',
                text: 'Skolskjuts beställd',
            }
        ]
    },
    {
        heading: 'FREDAG 10 NOVEMBER',
        data: [
            {
                id: '3ac68afc',
                title: 'Avfallshämtning',
                text: 'Avfallshämtning beställd',
                iconName: 'perm-contact-calendar'
            },
            {
                id: '58694a0f',
                title: 'Bygglov',
                text: 'Bygglov godkänt',
                iconName: 'perm-contact-calendar'
            },
        ]
    },
];
