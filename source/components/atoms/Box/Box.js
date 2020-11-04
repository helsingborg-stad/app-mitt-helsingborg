import React from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components/native';

const BoxBase = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;

  max-width: 100%;
  min-height: 56px;
`;

const Box = props => {
  const { color } = props;
  return <BoxBase>{children}</BoxBase>;
};

export default Box;

Box.propTypes = {
  color: PropTypes.string,
};
