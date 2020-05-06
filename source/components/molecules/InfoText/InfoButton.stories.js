import { storiesOf } from '@storybook/react-native';
import React from 'react';
import styled from 'styled-components/native';
import StoryWrapper from '../ScreenWrapper';
import InfoText from './InfoText';

const text = `Lorem Ipsum is simply dummy text of the printing and typesetting industry.
Lorem sIpsum has been the industry's standard dummy text ever since the 1500s, when an
unknown printer took a galley of type and scrambled it to make a type specimen book.
It has survived not only five centuries, but also the leap into electronic
typesetting, remaining essentially unchanged.
Lorem Ipsum is simply dummy text of the printing and typesetting industry.
Lorem sIpsum has been the industry's standard dummy text ever since the 1500s, when an
unknown printer took a galley of type and scrambled it to make a type specimen book.
It has survived not only five centuries, but also the leap into electronic
typesetting, remaining essentially unchanged.
Lorem Ipsum is simply dummy text of the printing and typesetting industry.
Lorem sIpsum has been the industry's standard dummy text ever since the 1500s, when an
unknown printer took a galley of type and scrambled it to make a type specimen book.
It has survived not only five centuries, but also the leap into electronic
typesetting, remaining essentially unchanged.
`;

storiesOf('InfoTextButton', module).add('With Text', props => (
  <StoryWrapper {...props}>
    <InfoTextBase />
  </StoryWrapper>
));

const InfoTextBase = injectProps => (
  <FlexContainer>
    <Flex>
      <InfoText {...injectProps} text={text} heading="Loan" textHeading="What is Loan" />
    </Flex>
  </FlexContainer>
);

const Flex = styled.View`
  padding: 8px;
`;

const FlexContainer = styled.View`
  flex: 1;
`;
