/* eslint-disable no-nested-ternary */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { NativeSyntheticEvent, NativeScrollEvent, View } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import styled from 'styled-components/native';
import { Text, Button } from '../../atoms';
import { ScreenWrapper } from '..';
import { Modal, useModal } from '../Modal';
import uploadFile from '../../../helpers/FileUpload';
import { excludePropetiesWithKey } from '../../../helpers/Objects';
import HorizontalScrollIndicator from '../../atoms/HorizontalScrollIndicator';
import ImageItem from './ImageItem';

const Wrapper = styled(ScreenWrapper)`
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

const PopupContainer = styled.View`
  position: absolute;
  z-index: 1000;
  top: 80%;
  left: 5%;
  right: 5%;
  padding: 0px;
  width: 90%;
  flex-direction: column;
  border-radius: 6px;
  shadow-offset: 0 0;
  shadow-opacity: 0.1;
  shadow-radius: 6px;
  flex-direction: row;
  justify-content: space-between;
`;

export type ImageStatus = 'loading' | 'uploaded' | 'error';

interface Props {
  buttonText: string;
  images: Record<string, string>[];
  onChange: (value: Record<string, string | number>[]) => void;
}

const emptyList: Record<string, string | number>[] = [];
const emptyStringList: string[] = [];

const ImageUploader: React.FC<Props> = ({ buttonText, images: imgs, onChange }) => {
  const [images, setImages] = useState(emptyList);
  const [imageData, setImageData] = useState(emptyStringList);
  const [loadedStatus, setLoadedStatus] = useState([]);
  const [horizontalScrollPercentage, setHorizontalScrollPercentage] = useState(0);
  const [visible, toggleModal] = useModal();

  useEffect(() => {
    if (imgs) {
      setImages(imgs);
    }
    // need more logic here to load in images, using their local uris...
  }, [imgs]);

  // useEffect(() => {
  //   images.forEach(async (image, index) => {
  //     if (imageData[index] && loadedStatus[index] === 'loading') {
  //       await uploadImage(image, index);
  //     }
  //   })
  // }, [images, imageData]);

  const addImagesToState = (newImages: Record<string, string | number>[]) => {
    const index = images.length;
    const newImagesWithoutData = newImages.map((image) => excludePropetiesWithKey(image, ['data']));
    setImages((old) => [...old, ...newImagesWithoutData]);
    setImageData((old) => [...old, ...newImages.map((image) => image.data.toString())]);
    setLoadedStatus((old) => [...old, ...newImages.map(() => 'loading')]);

    return index;
  };

  const removeImageFromState = (index: number) => () => {
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

  // const getBlob = async (fileUri: string) => {
  //   const resp = await fetch(fileUri);
  //   const imageBody = await resp.blob();
  //   return imageBody;
  // };

  const uploadImage = async (image: Record<string, string | number>, index: number) => {
    const imageFileType = (image.path as string).split('.').pop();
    const filename = (image.path as string).split('/').pop();
    // const imageBlob = await getBlob(imageData.uri);
    const data = imageData[index];
    const uploadResponse = await uploadFile(
      'users/me/attachments',
      filename,
      imageFileType,
      data
    );

    if (uploadResponse.error) {
      // more error handling needed, display some error message and stuff.
      setLoadedStatus((old) => {
        old[index] = 'error';
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
        old[index] = 'uploaded';
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
    ImagePicker.openPicker({
      cropping: true,
      multiple: true,
      includeBase64: true,
    })
      .then((res) => {
        addImagesToState(res);
        // if (res.didCancel) {
        //   console.log('User cancelled!');
        // } else if (res.error) {
        //   console.log('Error', res.error);
        // } else {
        //   if (!res.fileName) {
        //     res.fileName = res.uri.split('/').pop();
        //   }
        //   res.status = ImageStatus.loading;
        //   const index = addImageToState(res);

        //   uploadImage(res, index);
        // }
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

  return (
    <>
      <Wrapper>
        <Container horizontal onScroll={handleScroll} showsHorizontalScrollIndicator={false}>
          {images.map((image, index) => (
            <ImageItem
              key={`${image.path}-${index}`}
              filename={(image.path as string)}
              onRemove={removeImageFromState(index)}
              status={loadedStatus[index]}
            />
          ))}
        </Container>
        {images.length > 2 && <HorizontalScrollIndicator percentage={horizontalScrollPercentage} />}
        <ButtonContainer>
          <Button onClick={toggleModal}>
            <Text> {buttonText && buttonText !== '' ? buttonText : 'Ladda upp bild'}</Text>
          </Button>
        </ButtonContainer>
      </Wrapper>
      <Modal visible={visible} hide={toggleModal} presentationStyle="overFullScreen" transparent>
        <BackgroundBlur>
          <PopupContainer>
            <Button>
              <Text>Använd Kamera</Text>
            </Button>
            <Button
              onClick={() => {
                addImage();
                toggleModal();
              }}
            >
              <Text>Välj Fil</Text>
            </Button>
            <Button onClick={toggleModal} colorSchema="red">
              <Text>Avbryt</Text>
            </Button>
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
  images: PropTypes.array,
  /** What happens when either deleting or uploading an image */
  onChange: PropTypes.func,
};

export default ImageUploader;
