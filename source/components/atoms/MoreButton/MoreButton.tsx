import React from "react";

import { Icon } from "..";

import MoreButtonContainer from "./MoreButton.styled";

import type { Props } from "./MoreButton.types";

function MoreButton({ onPress }: Props): JSX.Element {
  return (
    <MoreButtonContainer onPress={onPress}>
      <Icon name="more-horiz" />
    </MoreButtonContainer>
  );
}

export default MoreButton;
