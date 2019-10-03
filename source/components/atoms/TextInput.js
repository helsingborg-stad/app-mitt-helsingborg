import React from 'react'
import PropTypes from 'prop-types'
import { TextInput as RNTextInput } from 'react-native';
import styled from 'styled-components/native';

const TextInput = styled(RNTextInput)`
    background-color: ${({theme}) => theme.input.background};
    border-radius: 15px;
    border: solid 1px ${({theme}) => theme.input.border};
    padding: 16px;
`;

TextInput.propTypes = {}

TextInput.defaultProps = {
    theme: {
        input: {
            background: '#FFFFFF',
            border: '#E5E5E5'
        }
    }
};

export default TextInput
