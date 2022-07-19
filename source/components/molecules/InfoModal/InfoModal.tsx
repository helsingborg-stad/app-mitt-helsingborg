import React from "react";

import { Modal } from "../Modal";
import { Button, Text, Heading } from "../../atoms";
import { BackgroundBlurWrapper } from "../../atoms/BackgroundBlur";

import MarkdownConstructor from "../../../helpers/MarkdownConstructor";

import { getValidColorSchema } from "../../../styles/themeHelpers";
import {
  PopupContainer,
  Wrapper,
  Header,
  Form,
  Footer,
} from "./InfoModal.styled";

import type { Props } from "./InfoModal.types";

const InfoModal: React.FC<Props> = (props) => {
  const {
    visible,
    heading,
    markdownText,
    buttonText,
    colorSchema,
    toggleModal,
  } = props;

  const validColorSchema = getValidColorSchema(colorSchema);

  return (
    <Modal
      visible={visible}
      hide={toggleModal}
      transparent
      presentationStyle="overFullScreen"
      animationType="fade"
    >
      <BackgroundBlurWrapper>
        <Wrapper>
          <PopupContainer>
            {heading && (
              <Header>
                <Heading>{heading}</Heading>
              </Header>
            )}
            <Form
              contentContainerStyle={{
                paddingBottom: 30,
              }}
            >
              <MarkdownConstructor rawText={markdownText} />
            </Form>
            <Footer>
              <Button
                z={0}
                block
                onClick={toggleModal}
                colorSchema={validColorSchema}
              >
                <Text>{buttonText || "Stäng"}</Text>
              </Button>
            </Footer>
          </PopupContainer>
        </Wrapper>
      </BackgroundBlurWrapper>
    </Modal>
  );
};

export default InfoModal;
