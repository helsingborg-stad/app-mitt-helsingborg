import { storiesOf } from '@storybook/react-native';
import React from 'react';
import styled from 'styled-components/native';
import StoryWrapper from '../../molecules/StoryWrapper';
import ImagePicker from './ImagePicker';

storiesOf('ImagePicker', module)
  .add('Default', props => (
    <StoryWrapper {...props}>
      <ImagePickerColors />
    </StoryWrapper>
  ))
  .add('With Text', props => (
    <StoryWrapper {...props}>
      <ImagePickerColors uploadText deleteText />
    </StoryWrapper>
  ))
  .add('With Text and Icon', props => (
    <StoryWrapper {...props}>
      <ImagePickerColors uploadText uploadIcon deleteText deleteIcon />
    </StoryWrapper>
  ))
  .add('With Text and selected Image', props => (
    <StoryWrapper {...props}>
      <ImagePickerColors uploadText deleteText showImage />
    </StoryWrapper>
  ));

const ImagePickerColors = injectProps => (
  <FlexContainer>
    <Flex>
      <ImagePicker color="purple" {...injectProps} />
    </Flex>
    <Flex>
      <ImagePicker color="blue" {...injectProps} />
    </Flex>
    <Flex>
      <ImagePicker color="light" {...injectProps} />
    </Flex>
    <Flex>
      <ImagePicker color="gray" {...injectProps} />
    </Flex>
    <Flex>
      <ImagePicker color="dark" {...injectProps} />
    </Flex>
  </FlexContainer>
);

const Flex = styled.View`
  padding: 8px;
`;

const FlexContainer = styled.View`
  flex: 1;
`;
