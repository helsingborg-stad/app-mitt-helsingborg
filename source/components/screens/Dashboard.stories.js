import React from 'react';
import { storiesOf } from '@storybook/react-native';
import StoryWrapper from '../molecules/StoryWrapper';
import CompletedTasks from '../molecules/CompletedTasks';

storiesOf('Dashboard', module)
  .add('Tasks', props => (
    <StoryWrapper {...props}>
      <CompletedTasks tasks={COMPLETED_TASKS} />
    </StoryWrapper>
  ))

const COMPLETED_TASKS = [
  {
    heading: 'TISDAG 3 NOVEMBER',
    data: [
      {
        id: 'bd7acbea',
        service: 'Skolskjuts',
        status: 'Skolskjuts beställd',
      }
    ]
  },
  {
    heading: 'FREDAG 10 NOVEMBER',
    data: [
      {
        id: '3ac68afc',
        service: 'Avfallshämtning',
        status: 'Avfallshämtning beställd',
      },
      {
        id: '58694a0f',
        service: 'Bygglov',
        status: 'Bygglov godkänt',
      },
    ]
  },
];
