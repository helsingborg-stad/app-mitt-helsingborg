import React, { useEffect, useState } from "react";
import ImageZoom from "react-native-image-pan-zoom";
import { readFile } from "react-native-fs";
import type { GestureResponderEvent } from "react-native";
import { TouchableOpacity, Dimensions, Image as RNImage } from "react-native";

import { Icon, Button, Text } from "../../atoms";

import { Modal, useModal } from "../Modal";

import { downloadFile } from "../../../helpers/FileUpload";

import {
  SafeArea,
  DefaultItem,
  Flex,
  DeleteBackground,
  ButtonWrapper,
  IconContainer,
  ImageIcon,
  ActivityWrapper,
  ActivityWrapperModal,
  ActivityIndicator,
  MAX_IMAGE_WIDTH,
} from "./ImageItem.styled";

import type { FileStatus, Props } from "./ImageItem.types";

const ImageItem: React.FC<Props> = ({ image, onRemove, onChange }) => {
  const [modalVisible, toggleModal] = useModal();
  const [fileStatus, setFileStatus] = useState<FileStatus>("checkLocalFile");
  const [downloadedFilePath, setDownloadedFilePath] = useState("");

  useEffect(() => {
    const downloadImage = async () => {
      const downloadPath = await downloadFile({
        endpoint: "users/me/attachments",
        filename: image.uploadedFileName,
      });
      setDownloadedFilePath(downloadPath);
      setFileStatus("downloadedFileAvailable");
      image.path = downloadPath;
      if (onChange) {
        // update answer object with path to the newly downloaded file
        onChange(image);
      }
    };
    const checkStatus = async () => {
      if (fileStatus === "checkLocalFile") {
        try {
          // check if the file exists in cache, by trying to read it.
          await readFile(image.path, "base64");
          setFileStatus("localFileAvailable");
        } catch (fileNotFound) {
          // if we don't find the file, set status to 'downloading',
          // and start downloading
          setFileStatus("downloading");
          downloadImage();
        }
      }
    };

    checkStatus();
  }, [fileStatus, image, onChange]);

  const handleRemove = (event: GestureResponderEvent) => {
    event.stopPropagation();
    onRemove();
  };

  return (
    <React.Fragment key={image.id}>
      <DefaultItem onPress={toggleModal} activeOpacity={0.1}>
        <Flex>
          <DeleteBackground>
            <TouchableOpacity onPress={handleRemove} activeOpacity={0.1}>
              <Icon name="clear" color="#00213F" />
            </TouchableOpacity>
          </DeleteBackground>
          <IconContainer>
            {fileStatus === "checkLocalFile" && (
              <ActivityWrapper>
                <ActivityIndicator size="large" color="#555555" />
              </ActivityWrapper>
            )}
            {fileStatus === "localFileAvailable" && (
              <ImageIcon source={{ uri: image.path }} />
            )}
            {fileStatus === "downloading" && (
              <ActivityWrapper>
                <ActivityIndicator size="large" color="gray" />
              </ActivityWrapper>
            )}
            {fileStatus === "downloadedFileAvailable" &&
              downloadedFilePath !== "" && (
                <ImageIcon source={{ uri: downloadedFilePath }} />
              )}
          </IconContainer>
        </Flex>
        <Text
          align="center"
          numberOfLines={1}
          style={{ width: MAX_IMAGE_WIDTH }}
        >
          {image.displayName}
        </Text>
      </DefaultItem>
      <Modal visible={modalVisible} hide={toggleModal}>
        {(fileStatus === "localFileAvailable" ||
          fileStatus === "downloadedFileAvailable") && (
          <SafeArea>
            <ImageZoom
              cropWidth={Dimensions.get("window").width}
              cropHeight={Dimensions.get("window").height * 0.89}
              imageWidth={image.width}
              imageHeight={image.height}
              panToMove
              enableCenterFocus={false}
              centerOn={{
                x: 0,
                y: 0,
                scale: Dimensions.get("window").width / image.width,
                duration: 10,
              }}
              minScale={Dimensions.get("window").width / image.width}
            >
              <RNImage
                style={{ width: image.width, height: image.height }}
                source={{
                  uri:
                    fileStatus === "localFileAvailable"
                      ? image.path
                      : downloadedFilePath,
                }}
              />
            </ImageZoom>
          </SafeArea>
        )}
        {(fileStatus === "downloading" || fileStatus === "checkLocalFile") && (
          <ActivityWrapperModal
            width={Dimensions.get("window").width}
            height={Dimensions.get("window").height * 0.89}
          >
            <ActivityIndicator size="large" color="gray" />
          </ActivityWrapperModal>
        )}
        <ButtonWrapper>
          <Button colorSchema="red" onClick={toggleModal}>
            <Text>Stäng</Text>
          </Button>
        </ButtonWrapper>
      </Modal>
    </React.Fragment>
  );
};

export default ImageItem;
