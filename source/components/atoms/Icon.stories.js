import React from 'react';
import { View, Text } from 'react-native';
import { storiesOf } from '@storybook/react-native';
import StoryWrapper from '../molecules/StoryWrapper';
import styled from 'styled-components/native';

import Icon from './Icon';

const Flex = styled.View`
    flex-direction: row;
`;

const Square = styled.View`
    height: 32px;
    width: 32px;
    background: #F7A600;
`;

storiesOf('Icon', module)
    .add('Material Icons', props => (
        <StoryWrapper {...props}>
            <Flex>
                <Icon size={16} name="sentiment-very-satisfied"/>
                <Icon size={24} name="sentiment-very-satisfied"/>
                <Icon size={32} name="sentiment-very-satisfied"/>
                <Icon size={48} name="sentiment-very-satisfied"/>
            </Flex>
        </StoryWrapper>
    ))
