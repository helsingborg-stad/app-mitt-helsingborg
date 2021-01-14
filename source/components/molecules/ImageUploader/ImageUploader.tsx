/* eslint-disable no-nested-ternary */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { NativeSyntheticEvent, NativeScrollEvent, TouchableOpacity } from 'react-native';
import ImagePicker, { Image as CropPickerImage } from 'react-native-image-crop-picker';
import styled from 'styled-components/native';
import { Text, Button, Icon, Label } from '../../atoms';
import { Modal, useModal } from '../Modal';
import uploadFile, { getBlob } from '../../../helpers/FileUpload';
import HorizontalScrollIndicator from '../../atoms/HorizontalScrollIndicator';
import { getValidColorSchema, PrimaryColor } from '../../../styles/themeHelpers';
import ImageItem from './ImageItem';

const Wrapper = styled.View`
  padding-left: 0;
  padding-right: 0;
  padding-top: 15px;
  padding-bottom: 0;
`;
const Container = styled.ScrollView`
  padding-left: 16px;
  padding-right: 16px;
`;
const ButtonContainer = styled.View`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 25px;
  width: 100%;
`;
const BackgroundBlur = styled.View`
  position: absolute;
  z-index: 1000;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 0px;
  background-color: rgba(0, 0, 0, 0.25);
`;

const PopupContainer = styled.View<{colorSchema: PrimaryColor}>`
  position: absolute;
  z-index: 1000;
  top: 60%;
  left: 5%;
  right: 5%;
  padding: 20px;
  width: 90%;
  background-color: ${(props) => props.theme.colors.complementary[props.colorSchema][0]}}
  border-radius: 6px;
  shadow-offset: 0 0;
  shadow-opacity: 0.1;
  shadow-radius: 6px;
  justify-content: space-between;
`;

const Row = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

const PopupLabel = styled(Label)<{colorSchema: PrimaryColor}>`
  color: ${props => props.theme.colors.primary[props.colorSchema][0]}
`;

const PopupButton = styled(Button)`
  border: 0;
  margin-bottom: 16px;
`;

interface Image extends CropPickerImage {
  errorMessage?: string;
  uploadedFileName?: string;
  url?: string;
}

export type ImageStatus = 'loading' | 'uploaded' | 'error';

interface Props {
  buttonText: string;
  value: Image[];
  onChange: (value: Record<string, any>[]) => void;
  colorSchema?: PrimaryColor;
  maxImages?: number;
}

const ImageUploader: React.FC<Props> = ({ buttonText, value: oldImages, onChange, colorSchema, maxImages }) => {
  const [images, setImages] = useState<Image[]>([]);
  const [loadedStatus, setLoadedStatus] = useState<ImageStatus[]>([]);
  const [horizontalScrollPercentage, setHorizontalScrollPercentage] = useState(0);
  const [choiceModalVisible, toggleModal] = useModal();

  useEffect(() => {
    // if the component is sent a list of existing images, we load them into the state
    if (oldImages) {
      setImages(oldImages);
    }
  }, [oldImages]);

  const addImagesToState = (newImages: Image[]) => {
    const oldNumberOfImages = images.length;
    setImages((oldImages) => [...oldImages, ...newImages]);

    const newStatuses: ImageStatus[] = newImages.map(() => 'loading');
    setLoadedStatus((oldStatuses) => [...oldStatuses, ...newStatuses]);

    return oldNumberOfImages;
  };

  const removeImageFromState = (index: number) => {
    setImages((old) => {
      old.splice(index, 1);
      return [...old];
    });
    setLoadedStatus((old) => {
      old.splice(index, 1);
      return [...old];
    });
  };

  const uploadImage = async (image: Image, index: number) => {
    const imageFileType = (image.path as string).split('.').pop();
    const data: Blob = await getBlob(image.path);
    const filename = (image.path as string).split('/').pop();
    const uploadResponse = await uploadFile(
      'users/me/attachments',
      filename,
      imageFileType,
      data
    );
    
    if (uploadResponse.error) {
      // we might need more error handling, like displaying an error message if the upload does not go through
      setLoadedStatus((old) => {
        old[index] = 'error';
        return [...old];
      });
      setImages((old) => {
        old[index].errorMessage = uploadResponse.message;
        if (onChange) {
          onChange(old as Record<string, any>[]);
        }
        return [...old];
      });
    } else {
      setLoadedStatus((old) => {
        old[index] = 'uploaded';
        return [...old];
      });
      // update the images at the right index with the returned info.
      setImages((old) => {
        old[index].uploadedFileName = uploadResponse.uploadedFileName;
        old[index].url = uploadResponse.url;
        if (onChange) {
          onChange(old);
        }
        return [...old];
      });
    }
  };

  const deleteImageFromCloudStorage = async (index: number) => {
    console.log('Placeholder: not implemented yet in API, want to delete image ', index);
  }

  const addImagesFromLibrary = () => {
    ImagePicker.openPicker({
      cropping: true,
      multiple: true,
      includeBase64: false,
    })
      .then((res) => {
        const length = addImagesToState(res);
        res.forEach((img, index) => {
          uploadImage(img, index + length);
        });        
      })
      .catch((reason) => {
        console.log('cancelled!', reason);
      });
  }

  const addImageFromCamera = () => {
    ImagePicker.openCamera({
      cropping: true,
      includeBase64: true,
    })
      .then((image) => {
        const length = addImagesToState([image]);
        uploadImage(image, length);
      })
      .catch((reason) => {
        console.log('cancelled!', reason);
      });
  };
  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    setHorizontalScrollPercentage(
      event.nativeEvent.contentOffset.x /
        (event.nativeEvent.contentSize.width - event.nativeEvent.layoutMeasurement.width)
    );
  };

  const validColorSchema = getValidColorSchema(colorSchema);
  return (
    <>
      <Wrapper>
        <Container horizontal onScroll={handleScroll} showsHorizontalScrollIndicator={false}>
          {images.map((image, index) => (
            <ImageItem
              key={`${image.path}-${index}`}
              filename={(image.path as string)}
              onRemove={() => {
                removeImageFromState(index);
                deleteImageFromCloudStorage(index);
              }}
            />
          ))}
        </Container>
        {images.length > 2 && <HorizontalScrollIndicator percentage={horizontalScrollPercentage} />}
        <ButtonContainer>
          <Button colorSchema={validColorSchema} onClick={toggleModal} disabled={maxImages && images.length >= maxImages}>
            <Icon name="add" />
            <Text> {buttonText && buttonText !== '' ? buttonText : 'Ladda upp bild'}</Text>
          </Button>
        </ButtonContainer>
      </Wrapper>
      <Modal visible={choiceModalVisible} hide={toggleModal} presentationStyle="overFullScreen" transparent animationType="fade">
        <BackgroundBlur>
          <PopupContainer colorSchema={validColorSchema} >
            <Row>
              <PopupLabel colorSchema={validColorSchema}>Lägg till bild</PopupLabel>
              <TouchableOpacity onPress={toggleModal} activeOpacity={1}>
                <Icon name="clear"/>
              </TouchableOpacity>
            </Row>
            <PopupButton
              colorSchema={validColorSchema}
              block
              variant="outlined"
              onClick={() => { 
                addImageFromCamera(); 
                toggleModal();
              }}
            >
              <Icon name="camera-alt" />
              <Text>Kamera</Text>
            </PopupButton>
            <PopupButton
              colorSchema={validColorSchema}
              block
              variant="outlined"
              onClick={() => {
                addImagesFromLibrary();
                toggleModal();
              }}
            >
              <Icon name="add-photo-alternate" />
              <Text>Bildbibliotek</Text>
            </PopupButton>
          </PopupContainer>
        </BackgroundBlur>
      </Modal>
    </>
  );
};

ImageUploader.propTypes = {
  /** The text on the upload button */
  buttonText: PropTypes.string,
  /** The images to initially populate the list with (i.e. their meta-data including uris) */
  value: PropTypes.array,
  /** What happens when either deleting or uploading an image, updating the form state */
  onChange: PropTypes.func,
};

export default ImageUploader;
