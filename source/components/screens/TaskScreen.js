import React, { Component } from 'react';
import ScreenWrapper from '../molecules/ScreenWrapper';
import GroupedList from '../molecules/GroupedList';

class TaskScreen extends Component {
    render() {
        return (
            <ScreenWrapper>
                <GroupedList
                    heading="Avslutade"
                    icon="chevron-right"
                    iconPosition="right"
                    items={COMPLETED_TASKS}
                />
            </ScreenWrapper>
        );
    }
}

export default TaskScreen;

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
            },
            {
                id: '58694a0f',
                title: 'Bygglov',
                text: 'Bygglov godkänt',
            },
        ]
    },
];
