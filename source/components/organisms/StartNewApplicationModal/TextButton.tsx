import React from "react";

import { TextButtonContainer, ButtonText } from "./TextButton.styled";

interface TextButtonProps {
  label: string;
  onPress: () => void;
}
const TextButton = ({ label, onPress }: TextButtonProps): JSX.Element => (
  <TextButtonContainer onPress={onPress}>
    <ButtonText>{label}</ButtonText>
  </TextButtonContainer>
);

export default TextButton;
