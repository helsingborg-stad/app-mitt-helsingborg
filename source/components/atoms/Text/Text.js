import React from 'react';
import { Text as RNText } from 'react-native';
import styled from 'styled-components/native';

const Text = styled(RNText)`
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  font-family: Roboto;
  flex-shrink: 1;
  color: ${props => props.theme.text.default};
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
