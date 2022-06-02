import React from "react";

import { TextButtonContainer, ButtonText } from "./TextButton.styled";

interface TextButtonProps {
  label: string;
  disabled?: boolean;
  onPress: () => void;
}
const TextButton = ({
  label,
  disabled = false,
  onPress,
}: TextButtonProps): JSX.Element => (
  <TextButtonContainer onPress={onPress} disabled={disabled}>
    <ButtonText disabled={disabled}>{label}</ButtonText>
  </TextButtonContainer>
);

export default TextButton;
