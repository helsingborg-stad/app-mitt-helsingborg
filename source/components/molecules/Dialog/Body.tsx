import React from 'react';
import styled from 'styled-components/native';

const Body = styled.View`
  width: 80%;
  height: auto;
  min-height: 160px;
  z-index: 1000;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  background: ${(props) => props.theme.colors.neutrals[5]};
  padding: 16px 16px;
  elevation: 2;
  shadow-offset: 0px 2px;
  shadow-color: black;
  shadow-opacity: 0.3;
  shadow-radius: 2px;
`;

export default Body;
