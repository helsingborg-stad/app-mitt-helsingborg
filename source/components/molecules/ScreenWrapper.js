import PropTypes from 'prop-types';
import React from 'react';
import { ThemeProvider } from 'styled-components';
import styled from 'styled-components/native';
import theme from '../../styles/theme';

const Container = styled.View`
  flex: 1;
  padding: 16px;
`;

const ScreenWrapper = props => {
  const { style, children } = props;

  return (
    <ThemeProvider theme={theme}>
      <Container style={style}>{children}</Container>
    </ThemeProvider>
  );
};

ScreenWrapper.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
  style: PropTypes.array,
};

export default ScreenWrapper;
