import React from 'react';
import { View, Text } from 'react-native';
import { storiesOf } from '@storybook/react-native';
import StoryWrapper from '../molecules/StoryWrapper';
import styled from 'styled-components/native';

import Icon from './Icon';
import Heading from './Heading';

import { categories } from '../../assets/material-icons.json';

storiesOf('Icon', module)
    .add('Material Icons', props => (
        <StoryWrapper {...props}>
            <Flex>
                <IconCategory {...categories.find(category => (category.name === 'navigation'))} />
            </Flex>
        </StoryWrapper>
    ))


const Flex = styled.View`
    flex-direction: row;
    flex-wrap: wrap;
`;

const IconCategory = (props) => (
    <>
        <Flex>
            <Heading type={'h3'}>{props.name.charAt(0).toUpperCase() + props.name.slice(1)}</Heading>
        </Flex>
        <Flex> 
            {props.icons.map(({name}) => (
                <Icon size={48} name={name.split(' ').join('-')} key={name.split(' ').join('-')} />
            ))}
        </Flex>
    </>

);