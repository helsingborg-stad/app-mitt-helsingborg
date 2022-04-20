/* eslint-disable import/prefer-default-export */
import styled, { css } from "styled-components/native";

const backgroundBlurDefault = css`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
`;

export const BackgroundBlurWrapper = styled.View`
  ${backgroundBlurDefault}
  z-index: 1000;
  padding: 0px;
  background-color: rgba(0, 0, 0, 0.75);
`;
