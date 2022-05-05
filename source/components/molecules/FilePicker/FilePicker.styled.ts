import styled from "styled-components/native";

import { Button, Label } from "../../atoms";

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
  top: 60%;
  left: 5%;
  right: 5%;
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

const Row = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

const PopupLabel = styled(Label)<{ colorSchema: PrimaryColor }>`
  color: ${(props) => props.theme.colors.primary[props.colorSchema][0]};
`;

const PopupButton = styled(Button)`
  border: 0;
  margin-bottom: 16px;
`;

export {
  Wrapper,
  ButtonContainer,
  PopupContainer,
  Row,
  PopupLabel,
  PopupButton,
};
