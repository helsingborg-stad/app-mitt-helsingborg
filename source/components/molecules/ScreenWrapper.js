import React, { Component } from 'react'
import { ThemeProvider } from 'styled-components';
import theme from '../../styles/theme';
import { View } from 'react-native';
import styled from 'styled-components/native';
import { PropTypes } from 'prop-types';

const Container = styled.View`
    flex: 1;
    align-items: stretch;
    padding: ${props => props.padd};
`;

const ScreenWrapper = props => (
    <ThemeProvider theme={theme}>
        <Container padd={props.padding}>
            {props.children}
        </Container>
    </ThemeProvider>
);

ScreenWrapper.defaultProps = {
    padding: '16px'
}

export default ScreenWrapper;