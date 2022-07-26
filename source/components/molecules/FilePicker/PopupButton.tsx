import React from "react";

import { Text, Icon } from "../../atoms";

import type { PrimaryColor } from "../../../theme/themeHelpers";

import StyledButton from "./PopupButton.styled";

interface Props {
  buttonText: string;
  colorSchema: PrimaryColor;
  icon: string;
  onClick: () => Promise<void>;
}
const PopupButton = ({
  buttonText,
  colorSchema,
  icon,
  onClick,
}: Props): JSX.Element => (
  <StyledButton
    key={buttonText}
    colorSchema={colorSchema}
    block
    variant="outlined"
    onClick={onClick}
  >
    <Icon name={icon} />
    <Text>{buttonText}</Text>
  </StyledButton>
);

export default PopupButton;
