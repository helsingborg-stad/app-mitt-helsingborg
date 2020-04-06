/* eslint-disable no-nested-ternary */

import React, { useState } from 'react';
import { StyleSheet, Image } from 'react-native';
import ImagePicker from 'react-native-image-picker';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import Button from '../../atoms/Button/Button';
import Icon from '../../atoms/Icon';
import Text from '../../atoms/Text';

const styles = StyleSheet.create({
  textContainer: {
    paddingRight: 10,
  },
  displayFile: {
    width: 100,
  },
  icon: {
    margin: 0,
    padding: 0,
  },
  image: {
    height: 50,
    width: 100,
  },
});

const DeleteContainer = styled.View`
  max-width: 80%;
  flex-direction: row;
  justify-content: space-between;
  padding: 0;
`;

const DisplayContainer = styled.View`
  flex-direction: column;
  padding-bottom: 10;
`;

const ButtonBase = styled.View``;

const ImagePickerContainer = props => {
  const { uploadIcon, uploadText, deleteIcon, deleteText, color, showImage } = props;
  const [pickedImage, setPickedImage] = useState(null);
  const [displayFileName, setDisplayFileName] = useState(null);

  const reset = () => {
    setPickedImage(null);
  };

  const pickImageHandler = () => {
    ImagePicker.showImagePicker(
      {
        title: 'Pick an Image',
        maxWidth: 800,
        maxHeight: 600,
        allowsEditing: true,
        storageOptions: {
          skipBackup: true,
          path: 'images',
          waitUntilSaved: true,
        },
      },
      res => {
        if (res.didCancel) {
          console.log('User cancelled!');
        } else if (res.error) {
          console.log('Error', res.error);
        } else {
          setPickedImage({
            filePath: res,
            fileData: res.data,
            fileUri: res.uri,
          });
          setDisplayFileName(
            res.uri
              .split('\\')
              .pop()
              .split('/')
              .pop()
          );
        }
      }
    );
  };

  const resetHandler = () => {
    reset();
  };

  const deleteFile = (
    <DeleteContainer>
      <DisplayContainer>
        {pickedImage && showImage ? (
          <Image
            source={{ uri: `data:image/jpeg;base64,${pickedImage.fileData}` }}
            style={styles.image}
          />
        ) : (
          <Text style={styles.displayFile} small>
            {displayFileName}
          </Text>
        )}
      </DisplayContainer>
      <Button style={styles.icon} color="red" onClick={resetHandler} z={1} size="small">
        {deleteIcon && deleteText ? (
          <>
            <Text>Ta bort</Text>
            <Icon name="clear" />
          </>
        ) : deleteText ? (
          <Text>Ta bort</Text>
        ) : (
          <Icon name="clear" />
        )}
      </Button>
    </DeleteContainer>
  );

  const uploadFile = (
    <Button color={color} onClick={pickImageHandler} size="small">
      {uploadText && uploadIcon ? (
        <>
          <Text style={styles.textContainer}>Ladda upp</Text>
          <Icon style={styles.textContainer} name="camera-enhance" size={32} />
        </>
      ) : uploadText ? (
        <Text>Ladda upp</Text>
      ) : (
        <Icon name="camera-enhance" size={32} />
      )}
    </Button>
  );

  return <ButtonBase>{pickedImage ? deleteFile : uploadFile}</ButtonBase>;
};

ImagePickerContainer.propTypes = {
  uploadIcon: PropTypes.bool,
  uploadText: PropTypes.bool,
  deleteIcon: PropTypes.bool,
  deleteText: PropTypes.bool,
  showImage: PropTypes.bool,
  color: PropTypes.string,
};

ImagePickerContainer.defaultProps = {
  uploadIcon: false,
  uploadText: false,
  deleteIcon: false,
  deleteText: false,
  showImage: false,
  color: 'light',
};

export default ImagePickerContainer;
