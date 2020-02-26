import { storiesOf } from '@storybook/react-native';
import React from 'react';
import styled from 'styled-components/native';
import StoryWrapper from '../../molecules/StoryWrapper';
import Icon from '../Icon';
import Text from '../Text';
import Button from './Button';

storiesOf('Button', module)
  .add('Default', props => (
    <StoryWrapper {...props}>
      <ButtonColors />
    </StoryWrapper>
  ))
  .add('Small', props => (
    <StoryWrapper {...props}>
      <ButtonColors size="small" />
    </StoryWrapper>
  ))
  .add('Rounded', props => (
    <StoryWrapper {...props}>
      <ButtonColors rounded />
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
          <CustomButton color="light" block>
            <CustomButtonText>Button with custom styles</CustomButtonText>
          </CustomButton>
        </Flex>
      </FlexContainer>
    </StoryWrapper>
  ))
  .add('with icon', props => (
    <StoryWrapper {...props}>
      <FlexContainer>
        <Flex>
          <Button color="purple" z={5} rounded>
            <Icon name="arrow-upward" pill />
          </Button>
        </Flex>
        <Flex>
          <Button color="purple" pill>
            <Text>Icon right</Text>
            <Icon name="arrow-upward" />
          </Button>
        </Flex>
        <Flex>
          <Button color="light" rounded>
            <Icon name="message" />
            <Text>Icon Left</Text>
          </Button>
        </Flex>
        <Flex>
          <Button color="blue" pill>
            <Icon name="message" />
            <Text>Skriv en fråga</Text>
          </Button>
        </Flex>
      </FlexContainer>
    </StoryWrapper>
  ))
  .add('Shadows', props => (
    <StoryWrapper {...props}>
      <FlexContainer>
        <Flex>
          <Button color="purple" z={4} rounded>
            <Text>z4</Text>
            <Icon name="arrow-upward" />
          </Button>
        </Flex>
        <Flex>
          <Button color="purple" z={3} rounded>
            <Text>z3</Text>
            <Icon name="arrow-upward" />
          </Button>
        </Flex>
        <Flex>
          <Button color="purple" z={2} rounded>
            <Text>z2</Text>
            <Icon name="arrow-upward" />
          </Button>
        </Flex>
        <Flex>
          <Button color="purple" z={1} rounded>
            <Text>z1</Text>
            <Icon name="arrow-upward" />
          </Button>
        </Flex>
        <Flex>
          <Button color="purple" z={0} rounded>
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
      <Button color="purple" {...injectProps}>
        <Text>Purple</Text>
      </Button>
    </Flex>
    <Flex>
      <Button color="blue" {...injectProps}>
        <Text>Blue</Text>
      </Button>
    </Flex>
    <Flex>
      <Button color="light" {...injectProps}>
        <Text>Light</Text>
      </Button>
    </Flex>
    <Flex>
      <Button color="gray" {...injectProps}>
        <Text>Gray</Text>
      </Button>
    </Flex>
    <Flex>
      <Button color="dark" {...injectProps}>
        <Text>Dark</Text>
      </Button>
    </Flex>
  </FlexContainer>
);

const CustomButton = styled(Button)`
  background-color: #afca05;
`;

const CustomButtonText = styled(Text)`
  color: #7b075e;
`;

const Flex = styled.View`
  padding: 8px;
`;

const FlexContainer = styled.View`
  flex: 1;
`;
