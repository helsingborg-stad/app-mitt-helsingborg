import React from "react";

import { Icon } from "..";

import IconContainer from "./MoreButton.styled";

function MoreButton({ onPress }) {
  return (
    <IconContainer onPress={onPress}>
      <Icon name="more-horiz" />
    </IconContainer>
  );
}

export default MoreButton;
