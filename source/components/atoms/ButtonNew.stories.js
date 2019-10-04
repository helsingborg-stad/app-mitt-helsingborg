import React from 'react';
import { View } from 'react-native';
import { storiesOf } from '@storybook/react-native';
import StoryWrapper from '../molecules/StoryWrapper';
import Button from './ButtonNew';
import styled, { css } from 'styled-components/native';
import Text from './Text';

storiesOf('Button', module)
    .add('Default', props => (
        <StoryWrapper {...props}>
            <ButtonColors />
        </StoryWrapper>
    ))
    .add('Pill', props => (
        <StoryWrapper {...props}>
            <ButtonColors pill />
        </StoryWrapper>
    ))
    .add('Block', props => (
        <StoryWrapper {...props}>
            <ButtonColors block />
        </StoryWrapper>
    ))
    .add('Custom style', props => (
        <StoryWrapper {...props}>
            <FlexContainer>
                <Flex>
                    <CustomButton color={'white'} block>
                        <CustomButtonText>Button with custom styles</CustomButtonText>
                    </CustomButton>
                </Flex>
            </FlexContainer>
        </StoryWrapper>
    ))

const ButtonColors = injectProps => (
        <FlexContainer>
        <Flex>
            <Button color={'purple'} {...injectProps}>
                <Text>Purple button</Text>
            </Button>
        </Flex>
        <Flex>
            <Button color={'blue'} {...injectProps}>
                <Text>Blue button</Text>
            </Button>
        </Flex>
        <Flex>
            <Button color={'white'} {...injectProps}>
                <Text>White button</Text>
            </Button>
        </Flex>
    </FlexContainer>
);

const CustomButton = styled(Button)`
    background-color: #AFCA05;
`;

const CustomButtonText = styled(Text)`
    color: #7B075E;
`;

const Flex = styled.View`
    margin-bottom: 8px;
`;

const FlexContainer = styled.View`
    flex-direction: column;
`;

