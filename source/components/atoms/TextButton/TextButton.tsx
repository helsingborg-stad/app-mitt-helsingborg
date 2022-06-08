import React from "react";

import { TextButtonContainer, ButtonText } from "./TextButton.styled";

interface TextButtonProps {
  label: string;
  disabled?: boolean;
  onPress: () => void;
}
export default function TextButton(props: TextButtonProps): JSX.Element {
  const { label, disabled, onPress } = props;

  return (
    <TextButtonContainer onPress={onPress} disabled={disabled}>
      <ButtonText disabled={disabled}>{label}</ButtonText>
    </TextButtonContainer>
  );
}
