import React, { Component } from 'react'
import { ThemeProvider } from 'styled-components';
import theme from '../../styles/theme';
import { View } from 'react-native';
import styled from 'styled-components/native';
import { PropTypes } from 'prop-types';

const Container = styled.View`
    flex: 1;
    padding: 16px;
`;

const ScreenWrapper = props => (
    <ThemeProvider theme={theme}>
        <Container style={props.style}>
            {props.children}
        </Container>
    </ThemeProvider>
);

export default ScreenWrapper;