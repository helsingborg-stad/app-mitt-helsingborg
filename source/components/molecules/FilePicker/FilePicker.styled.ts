import styled from "styled-components/native";

import { PrimaryColor, ComplementaryColor } from "../../../styles/themeHelpers";

const Wrapper = styled.View`
  padding: 15px 0 0 0;
`;
const ButtonContainer = styled.View`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 25px;
  width: 100%;
`;

interface PopupContainerProps {
  colorSchema: PrimaryColor;
  theme: {
    colors: {
      complementary: Record<string, ComplementaryColor>;
    };
  };
}
const PopupContainer = styled.View<PopupContainerProps>`
  position: absolute;
  z-index: 1000;
  left: 5%;
  right: 5%;
  bottom: 0px;
  padding: 20px;
  width: 90%;
  background-color: ${(props) =>
    props.theme.colors.complementary[props.colorSchema][0]};
  border-radius: 6px;
  shadow-offset: 0 0;
  shadow-opacity: 0.1;
  shadow-radius: 6px;
  justify-content: space-between;
`;

const OverflowAvoidingView = styled.View`
  flex: 1;
`;

export { Wrapper, ButtonContainer, PopupContainer, OverflowAvoidingView };
