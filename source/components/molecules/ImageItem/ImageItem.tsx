import React from "react";
import {
  TouchableOpacity,
  Dimensions,
  Image as RNImage,
  Platform,
} from "react-native";

import type { GestureResponderEvent } from "react-native";
import { Icon, Button, Text } from "../../atoms";

import { Modal, useModal } from "../Modal";

import {
  ModalView,
  DefaultItem,
  Flex,
  DeleteBackground,
  ButtonWrapper,
  IconContainer,
  ImageIcon,
  MAX_IMAGE_WIDTH,
} from "./ImageItem.styled";

import type { Props } from "./ImageItem.types";
import defaultFileStorageService from "../../../services/storage/fileStorage/FileStorageService";

function ImageItem({ file, onRemove }: Props): JSX.Element {
  const [modalVisible, toggleModal] = useModal();

  const filePathBase = defaultFileStorageService.getFilePath(file.id);
  const filePath =
    Platform.OS === "android" ? `file:${filePathBase}` : filePathBase;

  const imageResizeMode = Platform.OS === "android" ? "stretch" : "cover";

  const handleRemove = (event: GestureResponderEvent) => {
    event.stopPropagation();
    onRemove();
  };

  return (
    <React.Fragment key={file.id}>
      <DefaultItem onPress={toggleModal} activeOpacity={0.1}>
        <Flex>
          <DeleteBackground>
            <TouchableOpacity onPress={handleRemove} activeOpacity={0.1}>
              <Icon name="clear" color="#00213F" />
            </TouchableOpacity>
          </DeleteBackground>
          <IconContainer>
            <ImageIcon source={{ uri: filePath }} />
          </IconContainer>
        </Flex>
        <Text
          align="center"
          numberOfLines={1}
          style={{ width: MAX_IMAGE_WIDTH }}
        >
          {file.deviceFileName}
        </Text>
      </DefaultItem>
      <Modal visible={modalVisible} hide={toggleModal}>
        <ModalView>
          {filePathBase && (
            <RNImage
              resizeMode={imageResizeMode}
              source={{ uri: filePath }}
              style={{
                width: Dimensions.get("window").width,
                height: Dimensions.get("window").height * 0.8,
              }}
            />
          )}
        </ModalView>
        <ButtonWrapper>
          <Button colorSchema="red" onClick={toggleModal}>
            <Text>Stäng</Text>
          </Button>
        </ButtonWrapper>
      </Modal>
    </React.Fragment>
  );
}

export default ImageItem;
