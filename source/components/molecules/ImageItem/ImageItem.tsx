import React, { useEffect, useState } from "react";
import ImageZoom from "react-native-image-pan-zoom";
import type { GestureResponderEvent } from "react-native";
import { TouchableOpacity, Dimensions, Image as RNImage } from "react-native";

import { Icon, Button, Text } from "../../atoms";

import { Modal, useModal } from "../Modal";

import {
  SafeArea,
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
  const [filePath, setFilePath] = useState<string | null>(null);

  useEffect(() => {
    const path = defaultFileStorageService.getFilePath(file.id);
    setFilePath(path);
  }, [file.id]);

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
        <SafeArea>
          <ImageZoom
            cropWidth={Dimensions.get("window").width}
            cropHeight={Dimensions.get("window").height * 0.89}
            panToMove
            enableCenterFocus={false}
            centerOn={{
              x: 0,
              y: 0,
              scale: 1.0,
              duration: 10,
            }}
            minScale={1.0}
          >
            {filePath && <RNImage source={{ uri: filePath }} />}
          </ImageZoom>
        </SafeArea>
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
