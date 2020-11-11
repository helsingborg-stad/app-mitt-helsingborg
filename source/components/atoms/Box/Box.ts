import React from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components/native';

const Box = styled.View`
  ${props => props.p && `
    padding: ${props.p};
  `}

  ${props => props.py && `
    padding-top: ${props.py};
    padding-bottom: ${props.py};
  `}

  ${props => props.px && `
    padding-top: ${props.px};
    padding-bottom: ${props.px};
  `}

  ${props => props.pt && `
    padding-top: ${props.pt};
  `}

  ${props => props.pr && `
    padding-right: ${props.pr};
  `}

  ${props => props.pb && `
    padding-bottom: ${props.pb};
  `}

  ${props => props.pl && `
    padding-left: ${props.pl};
  `}
`;



Box.propTypes = {
  /**
   * Value for setting the top, right, bottom and left padding
   */
  p: PropTypes.string,
  /**
   * Value for setting the top and bottom padding;
   */
  py: PropTypes.string,
  /**
   * Value for setting the left and right padding;
   */
  px: PropTypes.string,
  /**
   * Value for setting the top padding.
   */
  pt: PropTypes.string,
  /**
   * Value for setting the right padding.
   */
  pr: PropTypes.string,
  /**
   * Value for setting the left padding.
   */
  pl: PropTypes.string,
  /**
   * Value for setting the bottom padding.
   */
  pb: PropTypes.string,
};

export default Box;
