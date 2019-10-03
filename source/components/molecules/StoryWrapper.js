import React from 'react'
import { SafeAreaView } from 'react-native';
import ScreenWrapper from './ScreenWrapper';
import styled from 'styled-components/native';

const EnhancedSafeAreaView = styled.SafeAreaView`
    flex: 1;
    margin-bottom: 18px;
`;

const StoryWrapper = props => (
    <EnhancedSafeAreaView>
        <ScreenWrapper>
            {props.children}
        </ScreenWrapper>
    </EnhancedSafeAreaView>
);

export default StoryWrapper;
