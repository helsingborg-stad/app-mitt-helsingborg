/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import { ThemeProvider } from 'styled-components';
import { View } from 'react-native';
import styled from 'styled-components/native';
import { PropTypes } from 'prop-types';
import theme from '../../styles/theme';

const Container = styled.View`
  flex: 1;
  padding: 16px;
`;

const ScreenWrapper = props => (
  <ThemeProvider theme={theme}>
    <Container style={props.style}>{props.children}</Container>
  </ThemeProvider>
);

export default ScreenWrapper;
