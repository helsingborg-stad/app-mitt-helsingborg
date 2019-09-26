import React, { Component } from 'react'
import { ThemeProvider } from 'styled-components';
import theme from '../../styles/theme';
import { View } from 'react-native';
import styled from 'styled-components/native';

const Container = styled.View`
    flex: 1;
    align-items: stretch;
    padding: 16px;
`;

const ScreenWrapper = props => (
    <ThemeProvider theme={theme}>
        <Container>
            {props.children}
        </Container>
    </ThemeProvider>
);

export default ScreenWrapper;