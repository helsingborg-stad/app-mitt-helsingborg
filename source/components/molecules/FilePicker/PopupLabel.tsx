import React from "react";
import { TouchableOpacity } from "react-native";

import { Icon } from "../../atoms";

import { Row, StyledLabel } from "./PopupLabel.styled";

import type { PrimaryColor } from "../../../styles/themeHelpers";

interface Props {
  labelText: string;
  colorSchema: PrimaryColor;
  showCloseButton: boolean;
  onClick: () => void;
}
const PopupLabel = ({
  labelText,
  colorSchema,
  showCloseButton,
  onClick,
}: Props): JSX.Element => (
  <Row>
    <StyledLabel colorSchema={colorSchema}>{labelText}</StyledLabel>
    {showCloseButton && (
      <TouchableOpacity onPress={onClick} activeOpacity={1}>
        <Icon name="clear" />
      </TouchableOpacity>
    )}
  </Row>
);

export default PopupLabel;
