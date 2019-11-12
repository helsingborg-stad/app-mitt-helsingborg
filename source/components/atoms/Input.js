import React from 'react'
import PropTypes from 'prop-types'
import { TextInput } from 'react-native';
import styled, { css } from 'styled-components/native';

const input = css`
    flex: 1;
    background-color: ${({theme}) => theme.input.background};
    border-radius: 17.5px;
    border: solid 1px ${({theme}) => theme.input.border};
    padding: 16px;
`;

const Input = styled(TextInput)`
    ${input}
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
export { input };