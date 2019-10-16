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
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
    service: 'Skolskjuts',
    status: 'Skolskjuts beställd',
    date: '2019-10-25T10:00:00'
  },
  {
    id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
    service: 'Avfallshämtning',
    status: 'Avfallshämtning beställd',
    date: '2019-10-25T15:00:00'
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d72',
    service: 'Bygglov',
    status: 'Bygglov godkänt',
    date: '2019-10-26T10:00:00'
  },
];
