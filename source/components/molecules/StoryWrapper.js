/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
import React from 'react';
import { SafeAreaView } from 'react-native';
import styled from 'styled-components/native';
import ScreenWrapper from './ScreenWrapper';
import Heading from '../atoms/Heading';

const StoryWrapper = props => (
  <EnhancedSafeAreaView>
    <ModifiedScreenWrapper style={props.style}>
      {props.kind ? <StoryHeading type="h2">{`${props.kind} / ${props.name}`}</StoryHeading> : null}
      {props.children}
    </ModifiedScreenWrapper>
  </EnhancedSafeAreaView>
);

const StoryHeading = styled(Heading)`
  margin-bottom: 16px;
  margin-top: 16px;
`;

const EnhancedSafeAreaView = styled.SafeAreaView`
  flex: 1;
  margin-bottom: 18px;
`;

const ModifiedScreenWrapper = styled(ScreenWrapper)`
  justify-content: flex-start;
`;

export default StoryWrapper;
