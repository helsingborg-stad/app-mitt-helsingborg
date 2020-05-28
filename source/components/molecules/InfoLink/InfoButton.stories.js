import { storiesOf } from '@storybook/react-native';
import React from 'react';
import styled from 'styled-components/native';
import StoryWrapper from '../ScreenWrapper';
import InfoLink from './InfoLink';

const URL = 'https://helsingborg.se/';

storiesOf('InfoWebButton', module).add('withLink', props => (
  <StoryWrapper {...props}>
    <InfoWebBase />
  </StoryWrapper>
));

const InfoWebBase = injectProps => (
  <FlexContainer>
    <Flex>
      <InfoLink {...injectProps} url={URL} />
    </Flex>
  </FlexContainer>
);

const Flex = styled.View`
  padding: 8px;
`;

const FlexContainer = styled.View`
  flex: 1;
`;
