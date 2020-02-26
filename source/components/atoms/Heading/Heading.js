/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import styled from 'styled-components/native';
import PropTypes from 'prop-types';
import Text from '../Text';

const fontSizes = {
  h1: 48,
  h2: 37,
  h3: 22,
  h4: 18,
};

const Heading = styled(Text)`
  font-style: normal;
  font-weight: 900;
  font-size: ${props => fontSizes[props.type || 'h1']}px;
  color: ${props => props.theme.text.heading};
  text-align: ${props => props.align || 'left'};
  margin-bottom: ${props => props.marginBottom || '0'}px;
`;

Heading.propTypes = {
  type: PropTypes.oneOf(Object.keys(fontSizes)),
};

Heading.defaultProps = {
  type: 'h2',
};

export const H1 = props => {
  const { ...other } = props;

  return (
    <Heading {...props} type="h1">
      {other.children}
    </Heading>
  );
};

export const H2 = props => {
  const { ...other } = props;

  return (
    <Heading {...props} type="h2">
      {other.children}
    </Heading>
  );
};
export const H3 = props => {
  const { ...other } = props;

  return (
    <Heading {...props} type="h3">
      {other.children}
    </Heading>
  );
};

export default Heading;
