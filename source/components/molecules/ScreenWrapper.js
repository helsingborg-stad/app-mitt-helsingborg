import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components/native';
import { Platform } from 'react-native';

const Container = styled.KeyboardAvoidingView`
  flex: 1;
  background-color: ${props => props.theme.colors.neutrals[6]};
`;

const ScreenWrapper = props => {
  const { style, children } = props;

  return (
    <Container
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={0}
      style={style}
    >
      {children}
    </Container>
  );
};

ScreenWrapper.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
  style: PropTypes.array,
};

export default ScreenWrapper;
