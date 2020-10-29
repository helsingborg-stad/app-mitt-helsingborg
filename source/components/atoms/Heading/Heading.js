/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { PropTypes } from 'prop-types';
import styled from 'styled-components/native';
import Text from '../Text';

const Heading = styled(Text)`
  font-style: normal;
  color: ${props => props.theme.colors.neutrals[0]};
  text-align: ${props => props.align};
  margin-bottom: ${props => props.marginBottom}px;
`;

Heading.propTypes = {
  type: PropTypes.oneOf('h1', 'h2', 'h3', 'h4'),
  marginBottom: PropTypes.string,
  align: PropTypes.oneOf('left', 'center', 'right'),
};

Heading.defaultProps = {
  type: 'h2',
  marginBottom: '0',
  align: 'left',
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
