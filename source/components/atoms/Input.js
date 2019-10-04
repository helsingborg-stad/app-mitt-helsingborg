import React from 'react'
import PropTypes from 'prop-types'
import { TextInput } from 'react-native';
import styled from 'styled-components/native';

const Input = styled(TextInput)`
    background-color: ${({theme}) => theme.input.background};
    border-radius: 15px;
    border: solid 1px ${({theme}) => theme.input.border};
    padding: 16px;
`;

Input.propTypes = {}

Input.defaultProps = {
    theme: {
        input: {
            background: '#FFFFFF',
            border: '#E5E5E5'
        }
    }
};

export default Input
