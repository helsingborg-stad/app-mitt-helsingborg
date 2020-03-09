import { css } from 'styled-components/native';

const SHADOW = {};

SHADOW[4] = css`
  shadow-color: #000;
  shadow-offset: -2px 12px;
  shadow-opacity: 0.3;
  shadow-radius: 12px;

  elevation: 4;
`;

SHADOW[3] = css`
  shadow-color: #000;
  shadow-offset: 0 8px;
  shadow-opacity: 0.3;
  shadow-radius: 8px;

  elevation: 3;
`;

SHADOW[2] = css`
  shadow-color: #000;
  shadow-offset: 0px 6px;
  shadow-opacity: 0.3;
  shadow-radius: 6px;

  elevation: 2;
`;

SHADOW[1] = css`
  shadow-color: #000;
  shadow-offset: -0px 2px;
  shadow-opacity: 0.3;
  shadow-radius: 2px;

  elevation: 1;
`;

SHADOW[0] = css`
  shadow-color: #000;
  shadow-opacity: 0;
  shadow-radius: 0px;
  shadow-offset: 0px 0px;

  elevation: 0;
`;

export default SHADOW;
