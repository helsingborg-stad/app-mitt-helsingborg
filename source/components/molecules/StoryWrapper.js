import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components/native';
import Heading from '../atoms/Heading';
import ScreenWrapper from './ScreenWrapper';

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

const StoryWrapper = props => {
  const { style, kind, name, children } = props;

  return (
    <EnhancedSafeAreaView>
      <ModifiedScreenWrapper style={style}>
        {kind ? <StoryHeading type="h2">{`${kind} / ${name}`}</StoryHeading> : null}
        {children}
      </ModifiedScreenWrapper>
    </EnhancedSafeAreaView>
  );
};

StoryWrapper.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
  kind: PropTypes.string,
  name: PropTypes.string,
  style: PropTypes.array,
};

export default StoryWrapper;
