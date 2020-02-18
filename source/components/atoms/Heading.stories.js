import React from 'react';
import { storiesOf } from '@storybook/react-native';
import StoryWrapper from '../molecules/StoryWrapper';
import Heading from './Heading';

storiesOf('Heading', module)
    .add('default', () => (
        <StoryWrapper>
            <Heading>Heading</Heading>
            <Heading type="h1">H1</Heading>
            <Heading type="h2">H2</Heading>
            <Heading type="h3">H3</Heading>
        </StoryWrapper>
));

