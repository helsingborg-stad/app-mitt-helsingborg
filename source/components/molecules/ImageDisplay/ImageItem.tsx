import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components/native";
import ImageZoom from "react-native-image-pan-zoom";
import { readFile } from "react-native-fs";
import type { GestureResponderEvent } from "react-native";
import { TouchableOpacity, Dimensions, Image as RNImage } from "react-native";
import { Icon, Button, Text } from "../../atoms";
import { Modal, useModal } from "../Modal";
import type { Image } from "./ImageDisplay";
import { downloadFile } from "../../../helpers/FileUpload";

const MAX_IMAGE_WIDTH = 120;
const MAX_IMAGE_HEIGHT = 170;

const DefaultItem = styled.TouchableOpacity`
  margin-bottom: 20px;
  margin-right: 20px;
`;
const Flex = styled.View`
  flex-direction: column;
  align-items: center;
  padding: 0;
  padding-top: 10px;
`;

const DeleteBackground = styled.View`
  position: absolute;
  top: -4px;
  right: -12px;
  padding: 4px;
  elevation: 3;
  background: #eeeeee;
  z-index: 1;
  border-radius: 20px;
`;
const ButtonWrapper = styled.View`
  flex-direction: row;
  margin-bottom: 40px;
  justify-content: center;
`;
const IconContainer = styled.View`
  margin: 2px;
  elevation: 2;
  shadow-offset: 0px 2px;
  shadow-color: black;
  shadow-opacity: 0.4;
  shadow-radius: 5px;
  border: 1px solid transparent;
`;
const ImageIcon = styled.Image`
  width: ${MAX_IMAGE_WIDTH}px;
  height: ${MAX_IMAGE_HEIGHT}px;
`;
const ActivityWrapper = styled.View`
  width: ${MAX_IMAGE_WIDTH}px;
  height: ${MAX_IMAGE_HEIGHT}px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;
const ActivityWrapperModal = styled.View<{ width: number; height: number }>`
  width: ${(props) => props.width}px;
  height: ${(props) => props.height}px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;
const ActivityIndicator = styled.ActivityIndicator`
  margin-top: 12px;
  margin-bottom: 24px;
`;

type FileStatus =
  | "checkLocalFile"
  | "localFileAvailable"
  | "downloading"
  | "downloadedFileAvailable";

interface Props {
  image: Image;
  onRemove: () => void;
  onChange?: (image: Image) => void;
}
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

ImageItem.propTypes = {
  image: PropTypes.object,
  onRemove: PropTypes.func,
  onChange: PropTypes.func,
};

export default ImageItem;
