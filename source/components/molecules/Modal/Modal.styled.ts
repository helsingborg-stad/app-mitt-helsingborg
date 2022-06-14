import styled from "styled-components/native";
import { Platform } from "react-native";

interface ModalViewProps {
  blur: boolean;
}

export default styled.View<ModalViewProps>`
  ${({ blur }) =>
    blur &&
    ` position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      z-index: 1000;
      padding: 0px;
      background-color: ${
        Platform.OS === "android"
          ? "rgba(0, 0, 0, 0.55)"
          : "rgba(0, 0, 0, 0.75)"
      };
    `}
  flex: 1;
`;
