import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const Container = styled(KeyboardAwareScrollView)`
  flex: 1;
  background-color: ${(props) => props.theme.colors.neutrals[6]};
`;

const ScreenWrapper = (props) => {
  const { style, children } = props;

  return <Container style={style}>{children}</Container>;
};

ScreenWrapper.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
  style: PropTypes.array,
};

export default ScreenWrapper;
