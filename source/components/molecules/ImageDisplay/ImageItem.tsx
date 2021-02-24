/* eslint-disable no-nested-ternary */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import ImageZoom from 'react-native-image-pan-zoom';
import { readFile } from 'react-native-fs';
import {
  TouchableOpacity,
  Dimensions,
  Image as RNImage,
  GestureResponderEvent,
} from 'react-native';
import { Icon, Button, Text } from '../../atoms';
import { Modal, useModal } from '../Modal';
import { Image } from './ImageDisplay';
import { downloadFile } from '../../../helpers/FileUpload';

const DefaultItem = styled.TouchableOpacity`
  margin-bottom: 20px;
`;
const Flex = styled.View`
  flex-direction: column;
  align-items: center;
  padding: 0;
  padding-top: 10px;
  padding-right: 20px;
  margin: 0;
`;

const DeleteBackground = styled.View`
  position: absolute;
  top: 2px;
  right: 7px;
  padding: 4px;
  elevation: 3;
  background: #eeeeee;
  z-index: 1;
  border-radius: 20px;
`;
const ButtonWrapper = styled.View`
  padding: 5px;
  flex-direction: row;
  justify-content: center;
`;
const IconContainer = styled.View`
  margin: 2px
  elevation: 2;
  shadow-offset: 0px 2px;
  shadow-color: black;
  shadow-opacity: 0.4;
  shadow-radius: 5px;
  border: 1px solid transparent;
  elevation: 1;
`;
const ImageIcon = styled.Image`
  width: 126px;
  height: 178px;
`;
const ActivityWrapper = styled.View`
  width: 126px;
  height: 178px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;
const ActivityWrapperModal = styled.View<{width: number; height: number}>`
  width: ${props => props.width}px;
  height: ${props => props.height}px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;
const ActivityIndicator = styled.ActivityIndicator`
  margin-top: 12px;
  margin-bottom: 24px;
`;

type FileStatus =
  | 'checkLocalFile'
  | 'localFileAvailable'
  | 'downloading'
  | 'downloadedFileAvailable';

interface Props {
  image: Image;
  onRemove: () => void;
  onChange?: (image: Image) => void;
}
const ImageItem: React.FC<Props> = ({ image, onRemove, onChange }) => {
  const [modalVisible, toggleModal] = useModal();
  const [fileStatus, setFileStatus] = useState<FileStatus>('checkLocalFile');
  const [downloadedFilePath, setDownloadedFilePath] = useState('');

  useEffect(() => {
    const downloadImage = async () => {
      const downloadPath = await downloadFile({
        endpoint: 'users/me/attachments',
        filename: image.uploadedFileName,
      });
      setDownloadedFilePath(downloadPath);
      setFileStatus('downloadedFileAvailable');
      image.path = downloadPath;
      if (onChange) {
        // update answer object with path to the newly downloaded file
        onChange(image);
      }
    };
    const checkStatus = async () => {
      if (fileStatus === 'checkLocalFile') {
        try {
          // check if the file exists in cache, by trying to read it.
          await readFile(image.path, 'base64');
          setFileStatus('localFileAvailable');
        } catch (fileNotFound) {
          // if we don't find the file, set status to 'downloading',
          // and start downloading
          setFileStatus('downloading');
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
    <>
      <DefaultItem onPress={toggleModal} activeOpacity={0.1}>
        <Flex>
          <DeleteBackground>
            <TouchableOpacity onPress={handleRemove} activeOpacity={0.1}>
              <Icon name="clear" color="#00213F" />
            </TouchableOpacity>
          </DeleteBackground>
          <IconContainer>
            {fileStatus === 'checkLocalFile' && (
              <ActivityWrapper>
                <ActivityIndicator size="large" color="#555555" />
              </ActivityWrapper>
            )}
            {fileStatus === 'localFileAvailable' && <ImageIcon source={{ uri: image.path }} />}
            {fileStatus === 'downloading' && (
              <ActivityWrapper>
                <ActivityIndicator size="large" color="gray" />
              </ActivityWrapper>
            )}
            {fileStatus === 'downloadedFileAvailable' && downloadedFilePath !== '' && (
              <ImageIcon source={{ uri: downloadedFilePath }} />
            )}
          </IconContainer>
        </Flex>
      </DefaultItem>
      <Modal visible={modalVisible} hide={toggleModal}>
        {(fileStatus === 'localFileAvailable' || fileStatus === 'downloadedFileAvailable') && (
          <ImageZoom
            cropWidth={Dimensions.get('window').width}
            cropHeight={Dimensions.get('window').height * 0.89}
            imageWidth={image.width}
            imageHeight={image.height}
            panToMove
            enableCenterFocus={false}
            centerOn={{
              x: 0,
              y: 0,
              scale: Dimensions.get('window').width / image.width,
              duration: 10,
            }}
            minScale={Dimensions.get('window').width / image.width}
          >
            <RNImage
              style={{ width: image.width, height: image.height }}
              source={{
                uri: fileStatus === 'localFileAvailable' ? image.path : downloadedFilePath,
              }}
            />
          </ImageZoom>
        )}
        {(fileStatus === 'downloading' || fileStatus === 'checkLocalFile') && (
          <ActivityWrapperModal
            width={Dimensions.get('window').width}
            height={Dimensions.get('window').height * 0.89}
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
    </>
  );
};

ImageItem.propTypes = {
  image: PropTypes.object,
  onRemove: PropTypes.func,
  onChange: PropTypes.func,
};

export default ImageItem;
