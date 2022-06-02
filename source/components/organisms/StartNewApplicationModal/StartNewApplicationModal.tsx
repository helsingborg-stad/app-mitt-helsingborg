import React, { useState } from "react";

import Wrapper from "../../molecules/Dialog/Wrapper";
import { Modal } from "../../molecules/Modal";
import { BackgroundBlurWrapper } from "../../atoms/BackgroundBlur";

import ApplicationProdecureContent from "./ApplicationProdecureContent";
import AddCoApplicantContent from "./AddCoApplicantContent";
import TextButton from "./TextButton";

import { DialogContainer } from "./StartNewApplicationModal.styled";

export interface StartNewApplicationModalProps {
  visible: boolean;
  error?: string;
  onClose: () => void;
  onOpenForm: () => void;
}

enum Content {
  first,
  addCoapplicant,
}

export default function StartNewApplicationModal({
  visible,
  onClose,
  onOpenForm,
  error,
}: StartNewApplicationModalProps): JSX.Element {
  const [content, setShowContent] = useState(Content.first);

  const handleChangeModalConten = () => {
    setShowContent(Content.addCoapplicant);
  };

  return (
    <Modal
      visible={visible}
      hide={onClose}
      transparent
      presentationStyle="overFullScreen"
      animationType="fade"
      statusBarTranslucent
    >
      <BackgroundBlurWrapper>
        <Wrapper>
          <DialogContainer>
            {content === Content.first && (
              <ApplicationProdecureContent
                onChangeContent={handleChangeModalConten}
                onOpenForm={onOpenForm}
              />
            )}

            {content === Content.addCoapplicant && (
              <AddCoApplicantContent onOpenForm={onOpenForm} />
            )}

            <TextButton label="Avbryt" onPress={onClose} />
          </DialogContainer>
        </Wrapper>
      </BackgroundBlurWrapper>
    </Modal>
  );
}
