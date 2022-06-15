import React from "react";

import Wrapper from "../../molecules/Dialog/Wrapper";
import { Modal } from "../../molecules/Modal";

import { Text, TextButton } from "../../atoms";

import {
  DialogContainer,
  Container,
  StyledButton,
} from "./NewApplicationModal.styled";

import type { Props } from "./NewApplicationModal.types";

export default function NewApplicationModal({
  visible,
  onClose,
  onOpenForm,
  onChangeModal,
}: Props): JSX.Element {
  const buttonGroup = [
    { text: "Söker själv", onClick: onOpenForm },
    { text: "Söker med man, fru eller sambo", onClick: onChangeModal },
  ];

  return (
    <Modal
      visible={visible}
      presentationStyle="overFullScreen"
      animationType="fade"
    >
      <Wrapper>
        <DialogContainer>
          <Container border>
            <Text align="center" type="h5">
              Söker du själv eller ihop med någon?
            </Text>
          </Container>
          <Container border>
            <Text>
              Om du har en fru, man eller sambo ska ni söka bistånd tillsammans.
            </Text>
          </Container>
          <Container>
            {buttonGroup.map(({ text, onClick }) => (
              <StyledButton
                key={text}
                onClick={onClick}
                value={text}
                fullWidth
                colorSchema="red"
              />
            ))}
          </Container>
          <TextButton label="Avbryt" onPress={onClose} />
        </DialogContainer>
      </Wrapper>
    </Modal>
  );
}
