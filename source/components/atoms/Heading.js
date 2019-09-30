import React, { PureComponent } from 'react';
import { Text } from 'react-native';
import styled from 'styled-components/native';
import { PropTypes } from 'prop-types';

const fontSizes = {
    h1: 48,
    h2: 37,
    h3: 22
};

const Heading = styled.Text`
    font-style: normal;
    font-weight: 900;
    font-size: ${props => (fontSizes[props.type || 'h1'])}px;
    font-family: 'Roboto';
`;

Heading.propTypes = {
    type: PropTypes.oneOf(Object.keys(fontSizes))
};

Heading.defaultProps = {
    type: 'h2'
};


export const H1 = props => (<Heading {...props} type="h1">{props.children}</Heading>);
export const H2 = props => (<Heading {...props} type="h2">{props.children}</Heading>);
export const H3 = props => (<Heading {...props} type="h3">{props.children}</Heading>);

export default Heading;
