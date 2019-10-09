import React from 'react';
import { Text as RNText } from 'react-native';
import styled from 'styled-components/native';

const Text = styled(RNText)`
    font-style: normal;
    font-weight: 400;
    font-size: 18px;
    font-family: Roboto;
    color: ${props => (props.theme.text.default)};
`;

export default Text;