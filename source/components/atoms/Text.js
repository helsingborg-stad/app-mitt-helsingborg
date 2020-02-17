import React from 'react';
import { Text as RNText } from 'react-native';
import styled from 'styled-components/native';

const Text = styled(RNText)`
  font-style: normal;
  font-weight: 500;
  font-size: 18px;
  font-family: Roboto;
  color: ${props => props.theme.text.default};
  flexshrink: 1;
  ${({ small }) =>
    small &&
    `
      font-size: 12px;
    `}
  ${({ strong }) =>
    strong &&
    `
      font-weight: 900;
    `}
`;

export default Text;
