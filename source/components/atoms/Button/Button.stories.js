import { storiesOf } from '@storybook/react-native';
import React from 'react';
import styled from 'styled-components/native';
import StoryWrapper from '../../molecules/StoryWrapper';
import Icon from '../Icon';
import Text from '../Text';
import Button from './Button';

const Flex = styled.View`
  padding: 8px;
`;

const FlexContainer = styled.View`
  flex: 1;
`;

storiesOf('Button', module)
  .add('Contained Buttons', props => (
    <StoryWrapper {...props}>
      <ButtonColors />
    </StoryWrapper>
  ))
  .add('Outlined Buttons', props => (
    <StoryWrapper {...props}>
      <ButtonColors variant="outlined" />
    </StoryWrapper>
  ))
  .add('Link Buttons', props => (
    <StoryWrapper {...props}>
      <FlexContainer>
        <Flex>
          <Button colorSchema="purple" variant="link">
            <Icon name="arrow-forward" />
          </Button>
        </Flex>
        <Flex>
          <Button colorSchema="green" block variant="link">
            <Text>Icon right</Text>
            <Icon name="arrow-forward" />
          </Button>
        </Flex>
        <Flex>
          <Button colorSchema="blue" variant="link">
            <Icon name="arrow-back" />
            <Text>Icon left</Text>
          </Button>
        </Flex>
        <Flex>
          <Button variant="link" colorSchema="red" rounded>
            <Text>No icon</Text>
          </Button>
        </Flex>
      </FlexContainer>
    </StoryWrapper>
  ))
  .add('Sizes', props => (
    <StoryWrapper {...props}>
      <ButtonSizes />
    </StoryWrapper>
  ))
  .add('Block', props => (
    <StoryWrapper {...props}>
      <ButtonColors block />
      <ButtonColors block variant="outlined" />
    </StoryWrapper>
  ))
  .add('Icon', props => (
    <StoryWrapper {...props}>
      <FlexContainer>
        <Flex>
          <Button colorSchema="purple" rounded>
            <Icon name="arrow-upward" pill />
          </Button>
        </Flex>
        <Flex>
          <Button colorSchema="purple" pill>
            <Text>Icon right</Text>
            <Icon name="arrow-upward" />
          </Button>
        </Flex>
        <Flex>
          <Button colorSchema="blue" pill>
            <Icon name="message" />
            <Text>Skriv en fråga</Text>
          </Button>
        </Flex>
        <Flex>
          <Button variant="outlined" colorSchema="purple" rounded>
            <Icon name="arrow-upward" pill />
          </Button>
        </Flex>
        <Flex>
          <Button variant="outlined" colorSchema="purple" pill>
            <Text>Icon right</Text>
            <Icon name="arrow-upward" />
          </Button>
        </Flex>
        <Flex>
          <Button variant="outlined" colorSchema="blue" pill>
            <Icon name="message" />
            <Text>Skriv en fråga</Text>
          </Button>
        </Flex>
      </FlexContainer>
    </StoryWrapper>
  ))
  .add('Elevation', props => (
    <StoryWrapper {...props}>
      <FlexContainer>
        <Flex>
          <Button colorSchema="purple" z={4} rounded>
            <Text>z4</Text>
            <Icon name="arrow-upward" />
          </Button>
        </Flex>
        <Flex>
          <Button colorSchema="purple" z={3} rounded>
            <Text>z3</Text>
            <Icon name="arrow-upward" />
          </Button>
        </Flex>
        <Flex>
          <Button colorSchema="purple" z={2} rounded>
            <Text>z2</Text>
            <Icon name="arrow-upward" />
          </Button>
        </Flex>
        <Flex>
          <Button colorSchema="purple" z={1} rounded>
            <Text>z1</Text>
            <Icon name="arrow-upward" />
          </Button>
        </Flex>
        <Flex>
          <Button colorSchema="purple" z={0} rounded>
            <Text>z0</Text>
            <Icon name="arrow-upward" />
          </Button>
        </Flex>
      </FlexContainer>
    </StoryWrapper>
  ));

const ButtonColors = injectProps => (
  <FlexContainer>
    <Flex>
      <Button colorSchema="blue" {...injectProps}>
        <Text>Blue</Text>
      </Button>
    </Flex>
    <Flex>
      <Button colorSchema="red" {...injectProps}>
        <Text>Red</Text>
      </Button>
    </Flex>
    <Flex>
      <Button colorSchema="purple" {...injectProps}>
        <Text>Purple</Text>
      </Button>
    </Flex>
    <Flex>
      <Button colorSchema="green" {...injectProps}>
        <Text>Green</Text>
      </Button>
    </Flex>
  </FlexContainer>
);

const ButtonSizes = injectProps => (
  <FlexContainer>
    <Flex>
      <Button size="small" {...injectProps}>
        <Text>Small</Text>
      </Button>
    </Flex>
    <Flex>
      <Button size="medium" {...injectProps}>
        <Text>Medium</Text>
      </Button>
    </Flex>
  </FlexContainer>
);
