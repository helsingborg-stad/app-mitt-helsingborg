import React from "react";

import { TextButtonContainer, ButtonText } from "./TextButton.styled";

import type { Props } from "./TextButton.types";

export default function TextButton(props: Props): JSX.Element {
  const { label, disabled, onPress } = props;

  return (
    <TextButtonContainer onPress={onPress} disabled={disabled}>
      <ButtonText disabled={disabled}>{label}</ButtonText>
    </TextButtonContainer>
  );
}
