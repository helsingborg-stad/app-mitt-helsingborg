import React from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity } from 'react-native';
import ImagePicker, { Options, ImageOrVideo } from 'react-native-image-crop-picker';
import styled from 'styled-components/native';
import { Text, Button, Icon, Label } from '../../atoms';
import { Modal, useModal } from '../Modal';
import { getBlob, uploadFile } from '../../../helpers/FileUpload';
import { getValidColorSchema, PrimaryColor } from '../../../styles/themeHelpers';
import ImageDisplay, { Image } from '../ImageDisplay/ImageDisplay';


const Wrapper = styled.View`
  padding-left: 0;
  padding-right: 0;
  padding-top: 15px;
  padding-bottom: 0;
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
  background-color: ${(props) => props.theme.colors.complementary[props.colorSchema][0]};
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
  color: ${props => props.theme.colors.primary[props.colorSchema][0]};
`;

const PopupButton = styled(Button)`
  border: 0;
  margin-bottom: 16px;
`;

export type ImageStatus = 'loading' | 'uploaded' | 'error';

export const uploadImage = async (image: Image) => {
    const imageFileType = (image.path as string).split('.').pop();

    if (!['jpg', 'jpeg', 'png'].includes(imageFileType)) {
      console.error(`Trying to upload a forbidden type of image, ${imageFileType}, allowed file types are [jpg, jpeg, png].`);
    }

    const data: Blob = await getBlob(image.path);
    const filename = (image.path as string).split('/').pop();
    const uploadResponse = await uploadFile({
      endpoint: 'users/me/attachments',
      fileName: filename,
      fileType: (imageFileType as 'jpg' | 'jpeg' | 'png'),
      data
    });

    if (uploadResponse.error) {
      throw uploadResponse?.message;
    }

    image.uploadedFileName = uploadResponse.uploadedFileName;
    image.url = uploadResponse.url;

  return image;
};

interface Props {
  buttonText: string;
  value: Image[] | '';
  answers: Record<string, any>;
  onChange: (value: Record<string, any>[], id?: string) => void;
  colorSchema?: PrimaryColor;
  maxImages?: number;
  id: string;
}

const ImageUploader: React.FC<Props> = ({ buttonText, value: images, answers, onChange, colorSchema, maxImages, id }) => {
  const [choiceModalVisible, toggleModal] = useModal();

  const addImagesToState = (newImages: Image[]) => {
    const updatedImages = images === '' ? [...newImages] : [...images, ...newImages];

    if (updatedImages.length > 0 && updatedImages[0].questionId) {
      onChange(updatedImages, updatedImages[0].questionId);
    }
    return updatedImages;
  };

  const transformRawImage = (rawImage: ImageOrVideo): Image => ({
    questionId: id,
    path: rawImage.path,
    filename: rawImage?.filename,
    width: rawImage.width,
    height: rawImage.height,
    size: rawImage.size,
    mime: rawImage?.filename?.split('.')?.pop() ?? rawImage.path?.split('.')?.pop()
  });

  const addImagesFromLibrary = async () => {
    try {
      const rawImages = await ImagePicker.openPicker({
        multiple: true,
        mediaType: 'photo',
        width: 800,
        height: 800,
        includeBase64: false,
        compressImageQuality: 0.5,
        compressImageMaxHeight: 800,
        compressImageMaxWidth: 800,
        writeTempFile: true,
        cropping: false,
        includeExif: false,
      });

      if (rawImages && rawImages.length > 0) {
        addImagesToState(rawImages.map(transformRawImage));
      }

    } catch (error) {
      if (error.code !== 'E_PICKER_CANCELLED')
        console.error(error);
    }
  };

  const addImageFromCamera =  async () => {
    try {
      const rawImage = await ImagePicker.openCamera({
        includeBase64: false,
        compressImageQuality: 0.8,
        compressImageMaxHeight: 1200,
        compressImageMaxWidth: 1200,
        cropping: false,
        includeExif: false,
      });

      if (rawImage) {
        addImagesToState([rawImage].map(transformRawImage));
      }

    } catch(error) {
      if (error.code !== 'E_PICKER_CANCELLED')
        console.error(error);
    }
  };

  const validColorSchema = getValidColorSchema(colorSchema);
  return (
    <>
      <Wrapper>
        {images !== '' && <ImageDisplay images={images} onChange={onChange} answers={answers} />}
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
                toggleModal();
                /** There's an issue on iOS with triggering the library before the modal has closed,
                 * so as a simple fix, we add a timeout (since toggleModal is async) */
                setTimeout(addImageFromCamera, 700);
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
                toggleModal();
                /** There's an issue on iOS with triggering the library before the modal has closed,
                 * so as a simple fix, we add a timeout (since toggleModal is async) */
                setTimeout(addImagesFromLibrary, 700);
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
  buttonText: PropTypes.string,
  /** Array of image objects to initially populate the list with (i.e. meta-data including uris) */
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  onChange: PropTypes.func,
  colorSchema: PropTypes.oneOf(['blue', 'red', 'green', 'purple', 'neutral']),
};

export default ImageUploader;
