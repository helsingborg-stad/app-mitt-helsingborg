import styled, { css } from "styled-components/native";
import { BlurView } from "@react-native-community/blur";

const backgroundBlurDefault = css`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
`;

export const BackgroundBlur = styled(BlurView)`
  ${backgroundBlurDefault}
`;

export const BackgroundBlurWrapper = styled.View`
  ${backgroundBlurDefault}
  z-index: 1000;
  padding: 0px;
  background-color: rgba(0, 0, 0, 0.25);
`;
