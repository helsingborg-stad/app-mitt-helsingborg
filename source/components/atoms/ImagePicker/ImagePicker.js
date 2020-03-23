/* eslint-disable no-nested-ternary */

import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import ImagePicker from 'react-native-image-picker';
import styled, { ThemeProvider } from 'styled-components';
import PropTypes from 'prop-types';
import Button from '../Button/Button';
import Icon from '../Icon';
import Text from '../Text';
import theme from '../../../styles/theme';

const styles = StyleSheet.create({
  textContainer: {
    paddingRight: 5,
  },
});

const DeleteContainer = styled.View`
  max-width: 80%;
  flex-direction: row;
  padding: 5px;
`;

const ButtonBase = styled.View``;

const ImagePickerContainer = props => {
  const { uploadIcon, uploadText, deleteIcon, deleteText, color } = props;
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
        storageOptions: {
          skipBackup: true,
          path: 'images',
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
      <Button size="medium" z={0}>
        <Text>{displayFileName} </Text>
      </Button>
      <Button color="swipe" onClick={resetHandler} z={1}>
        {deleteIcon && deleteText ? (
          <>
            <Text>Remove</Text>
            <Icon name="clear" />
          </>
        ) : deleteText ? (
          <Text>Remove</Text>
        ) : (
          <Icon name="clear" />
        )}
      </Button>
    </DeleteContainer>
  );

  const uploadFile = (
    <Button color={color} onClick={pickImageHandler}>
      {uploadText && uploadIcon ? (
        <>
          <Text style={styles.textContainer}>Upload</Text>
          <Icon style={styles.textContainer} name="camera-enhance" size={32} />
        </>
      ) : uploadText ? (
        <Text>Upload</Text>
      ) : (
        <Icon name="camera-enhance" size={32} />
      )}
    </Button>
  );

  return (
    <ThemeProvider theme={theme}>
      <ButtonBase>{pickedImage ? deleteFile : uploadFile}</ButtonBase>
    </ThemeProvider>
  );
};

ImagePickerContainer.propTypes = {
  uploadIcon: PropTypes.bool,
  uploadText: PropTypes.bool,
  deleteIcon: PropTypes.bool,
  deleteText: PropTypes.bool,
  color: PropTypes.string,
};

ImagePickerContainer.defaultProps = {
  uploadIcon: false,
  uploadText: false,
  deleteIcon: false,
  deleteText: false,
  color: 'light',
};

export default ImagePickerContainer;
