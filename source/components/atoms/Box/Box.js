import React from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components/native';

const BoxBase = styled.View``;

const Box = props => {
  const { margin, flexDirection, justifyContent, alignItems } = props;
  return <BoxBase>{children}</BoxBase>;
};

export default Box;

Box.propTypes = {
  margin: PropTypes.shape({
    mb: PropTypes.number,
    mt: PropTypes.number,
    ml: PropTypes.number,
    mr: PropTypes.number,
  }),
};
