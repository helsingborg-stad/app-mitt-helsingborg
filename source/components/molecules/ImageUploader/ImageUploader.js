/* eslint-disable no-nested-ternary */
import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import {TouchableHighlight, ActivityIndicator} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import styled from 'styled-components/native';
import {Heading, Text, Button, Icon} from '../components/atoms';
import {ScreenWrapper} from '../components/molecules';
import uploadFile from '../helpers/FileUpload';
import {excludePropetiesWithKey} from '../../../helpers/Objects';

const Wrapper = styled(ScreenWrapper)`
  padding-left: 0;
  padding-right: 0;
  padding-top: 15px;
  padding-bottom: 0;
  background-color: #f5f5f5;
`;
const Container = styled.ScrollView`
  padding-left: 16px;
  padding-right: 16px;
`;
const UploadIconContainer = styled.View`
  padding-left: 12px;
  padding-right: 12px;
`;
const DefaultItem = styled.TouchableHighlight`
  border-bottom-width: 1px;
  border-color: #c3c3c3;
  background-color: white;
  margin-bottom: 6px;
  border-radius: 8px;
`;
const ButtonContainer = styled.View`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 25px;
  width: 100%;
`;
const List = styled.View`
  margin-top: 24px;
`;
const ListHeading = styled(Heading)`
  margin-left: 4px;
  margin-bottom: 8px;
`;

const Flex = styled.View`
  flex-direction: row;
  align-items: center;
  padding-top: 15px;
  padding-bottom: 15px;
  padding-left: 15px;
  padding-right: 15px;
`;

const IconContainer = styled.View`
  width: 64px;
  border-top-left-radius: 12.5px;
  border-bottom-left-radius: 12.5px;
  margin-right: 14px;
`;

const IconFlex = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

const Content = styled.View`
  flex: 1;
  padding: 16px 0px 16px 8px;
`;

const ImageIcon = styled.Image`
  width: 64px;
  height: 64px;
`;

const ImageStatus = {
  loading: 'LOADING',
  finished: 'FINISHED',
  uploadError: 'UPLOAD_ERROR',
};

const ImageItem = ({imageData, fileName, onRemove, status}) => (
  <DefaultItem>
    <Flex>
      <IconContainer highlighted>
        <IconFlex>
          <ImageIcon source={{uri: `data:image/jpeg;base64,${imageData}`}} />
        </IconFlex>
      </IconContainer>
      <Content>
        <Text small>{fileName}</Text>
      </Content>
      <UploadIconContainer>
        {status === ImageStatus.finished ? (
          <Icon name="cloud-upload" color="green" />
        ) : status === ImageStatus.loading ? (
          <ActivityIndicator size="large" color="slategray" />
        ) : (
          <Icon name="error" color="red" />
        )}
      </UploadIconContainer>
      <TouchableHighlight onPress={onRemove}>
        <Icon name="delete" color="#00213F" />
      </TouchableHighlight>
    </Flex>
  </DefaultItem>
);
ImageItem.propTypes = {
  imageData: PropTypes.any,
  fileName: PropTypes.string,
  onRemove: PropTypes.func,
  status: PropTypes.oneOf(Object.values(ImageStatus)),
};

const ImageUploader = ({
  heading,
  buttonText,
  images: imgs,
  onChange,
  maxImages,
}) => {
  const [images, setImages] = useState([]);
  const [imageData, setImageData] = useState([]);
  const [loadedStatus, setLoadedStatus] = useState([]);

  useEffect(() => {
    if (imgs) {
      setImages(imgs);
    }
    // need more logic here to load in images, using their local uris...
  }, [imgs]);

  const addImageToState = (img) => {
    const index = images.length;
    const newImage = excludePropetiesWithKey(img, ['data']);
    setImages((old) => [...old, newImage]);
    setImageData((old) => [...old, img.data]);
    setLoadedStatus((old) => [...old, ImageStatus.loading]);

    return index;
  };

  const removeImageFromState = (index) => () => {
    setImages((old) => {
      old.splice(index, 1);
      return [...old];
    });
    setImageData((old) => {
      old.splice(index, 1);
      return [...old];
    });
    setLoadedStatus((old) => {
      old.splice(index, 1);
      return [...old];
    });
  };

  const getBlob = async (fileUri) => {
    const resp = await fetch(fileUri);
    const imageBody = await resp.blob();
    return imageBody;
  };

  const uploadImage = async (imageData, index) => {
    const imageFileType = imageData.fileName.split('.').pop();
    const imageBlob = await getBlob(imageData.uri);
    const uploadResponse = await uploadFile(
      'users/me/attachments',
      imageData.fileName,
      imageFileType,
      imageBlob,
    );

    if (uploadResponse.error) {
      // more error handling needed, display some error message and stuff.
      setLoadedStatus((old) => {
        old[index] = ImageStatus.uploadError;
        return [...old];
      });
      setImages((old) => {
        old[index].errorMessage = uploadResponse.message;
        if (onChange) {
          onChange(old);
        }
        return [...old];
      });
    } else {
      setLoadedStatus((old) => {
        old[index] = ImageStatus.finished;
        return [...old];
      });
      // update the images at the right index with the returned info.
      setImages((old) => {
        old[index].uploadedFileName = uploadResponse.uploadedFileName;
        if (onChange) {
          onChange(old);
        }
        return [...old];
      });
    }
  };

  const addImage = () => {
    ImagePicker.showImagePicker(
      {
        title: 'Välj en bild',
        maxWidth: 800,
        maxHeight: 600,
        allowsEditing: true,
        storageOptions: {
          skipBackup: true,
          path: 'images',
          waitUntilSaved: true,
        },
      },
      (res) => {
        if (res.didCancel) {
          console.log('User cancelled!');
        } else if (res.error) {
          console.log('Error', res.error);
        } else {
          if (!res.fileName) {
            res.fileName = res.uri.split('/').pop();
          }
          res.status = ImageStatus.loading;
          const index = addImageToState(res);

          uploadImage(res, index);
        }
      },
    );
  };

  return (
    <Wrapper>
      <Container>
        <List>
          <ListHeading type="h3">{heading}</ListHeading>
          {images.map((image, index) => (
            <ImageItem
              imageData={imageData[index]}
              fileName={image.fileName}
              onRemove={removeImageFromState(index)}
              status={loadedStatus[index]}
            />
          ))}
        </List>
        <ButtonContainer>
          {maxImages && maxImages > 0 && images.length < maxImages && (
            <Button onClick={addImage}>
              <Text>
                {' '}
                {buttonText && buttonText !== ''
                  ? buttonText
                  : 'Ladda upp bild'}
              </Text>
            </Button>
          )}
        </ButtonContainer>
      </Container>
    </Wrapper>
  );
};

ImageUploader.propTypes = {
  /** The heading on top of the list of pictures */
  heading: PropTypes.string,
  /** The text on the upload button */
  buttonText: PropTypes.string,
  /** The images to initially populate the list with (i.e. their meta-data including uris) */
  images: PropTypes.array,
  /** What happens when either deleting or uploading an image */
  onChange: PropTypes.func,
  /** The maximum number of images allowed by the component; if not specified it's arbitrarily many */
  maxImages: PropTypes.number,
};

export default ImageUploader;
