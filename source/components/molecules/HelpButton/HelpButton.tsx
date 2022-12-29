import React from "react";
import { TouchableHighlight, Linking } from "react-native";
import Icon from "../../atoms/Icon";
import Text from "../../atoms/Text";
import { Modal, useModal } from "../Modal";

import {
  ModalContainer,
  Container,
  StyledScrollView,
  CloseModal,
  Tagline,
  Heading,
  HelpText,
  LinkButton,
} from "./HelpButton.styled";

import type { Props } from "./HelpButton.types";

const HelpButton = ({
  text = "",
  size = 24,
  heading = "",
  tagline = "hjälp",
  url = "",
  icon = "help-outline",
}: Props): JSX.Element => {
  const [isModalVisible, toggleModal] = useModal();

  const link = () => {
    void Linking.openURL(url);
  };

  if (
    (!heading || heading.length === 0) &&
    (!text || text?.length === 0) &&
    url.length
  ) {
    return (
      <>
        <TouchableHighlight onPress={link} underlayColor="transparent">
          <Icon name="help-outline" size={size} />
        </TouchableHighlight>
      </>
    );
  }

  return (
    <>
      <Modal visible={isModalVisible} hide={toggleModal}>
        <ModalContainer>
          <CloseModal showBackButton={false} onClose={toggleModal} />
          <Container>
            <StyledScrollView>
              <Tagline>{tagline}</Tagline>
              <Heading>{heading}</Heading>
              <HelpText>{text?.length ? text : "Text not available"}</HelpText>
              {url.length > 0 ? (
                <LinkButton onClick={link} color="floral" block>
                  <Text>Läs mer</Text>
                  <Icon name="launch" />
                </LinkButton>
              ) : null}
            </StyledScrollView>
          </Container>
        </ModalContainer>
      </Modal>
      <TouchableHighlight onPress={toggleModal} underlayColor="transparent">
        <Icon name={icon} size={size} />
      </TouchableHighlight>
    </>
  );
};

export default HelpButton;
