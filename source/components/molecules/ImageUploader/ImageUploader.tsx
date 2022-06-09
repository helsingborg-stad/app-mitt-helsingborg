import React from "react";
import PropTypes from "prop-types";
import { Alert, TouchableOpacity } from "react-native";
import ImagePicker, { ImageOrVideo } from "react-native-image-crop-picker";
import uuid from "react-native-uuid";
import styled from "styled-components/native";
import { Text, Button, Icon, Label } from "../../atoms";
import { Modal, useModal } from "../Modal";
import {
  getValidColorSchema,
  PrimaryColor,
} from "../../../styles/themeHelpers";
import ImageDisplay, { Image } from "../ImageDisplay/ImageDisplay";
import { AllowedFileTypes, splitFilePath } from "../../../helpers/FileUpload";

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

const PopupContainer = styled.View<{ colorSchema: PrimaryColor }>`
  position: absolute;
  z-index: 1000;
  top: 60%;
  left: 5%;
  right: 5%;
  padding: 20px;
  width: 90%;
  background-color: ${(props) =>
    props.theme.colors.complementary[props.colorSchema][0]};
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

const PopupLabel = styled(Label)<{ colorSchema: PrimaryColor }>`
  color: ${(props) => props.theme.colors.primary[props.colorSchema][0]};
`;

const PopupButton = styled(Button)`
  border: 0;
  margin-bottom: 16px;
`;

export type ImageStatus = "loading" | "uploaded" | "error";

interface Props {
  buttonText: string;
  value: Image[] | "";
  answers: Record<string, any>;
  onChange: (value: Record<string, any>[], id?: string) => void;
  colorSchema?: PrimaryColor;
  maxImages?: number;
  id: string;
  preferredFileName?: string;
}

const MAX_IMAGE_SIZE_BYTES = 7 * 1000 * 1000;

const ImageUploader: React.FC<Props> = ({
  buttonText,
  value: images,
  answers,
  onChange,
  colorSchema,
  maxImages,
  id,
  preferredFileName,
  ...rest
}) => {
  const [choiceModalVisible, toggleModal] = useModal();

  const renameImageWithSuffix = (
    image: Image,
    baseName: string,
    ext: string,
    suffix: string
  ) => ({
    ...image,
    filename: `${baseName}_${suffix}${ext}`,
  });

  const addImagesToState = (newImages: Image[]) => {
    let updatedImages =
      images === "" ? [...newImages] : [...images, ...newImages];

    if (preferredFileName) {
      updatedImages = updatedImages.map((image, index) =>
        renameImageWithSuffix(
          image,
          preferredFileName,
          splitFilePath(image.filename).ext,
          index.toString()
        )
      );
    }

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
    fileType: (rawImage.path as string).split(".").pop() as AllowedFileTypes,
    id: uuid.v4(),
    mime:
      rawImage?.filename?.split(".")?.pop() ??
      (rawImage.path?.split(".")?.pop() as string),
  });

  const addImagesFromLibrary = async () => {
    try {
      const rawImages = await ImagePicker.openPicker({
        multiple: true,
        mediaType: "photo",
        includeBase64: false,
        compressImageQuality: 0.8,
        writeTempFile: true,
        cropping: false,
        includeExif: false,
      });

      if (rawImages && rawImages.length > 0) {
        const filteredImages = rawImages.filter(
          (image) => image.size <= MAX_IMAGE_SIZE_BYTES
        );

        if (filteredImages.length !== rawImages.length) {
          Alert.alert(
            "Ogiltiga bilder",
            "Några av de angivna bilder är för stora. Varje bild får max vara 7 Mb."
          );
        }

        if (filteredImages.length > 0) {
          addImagesToState(filteredImages.map(transformRawImage));
        }
      }
    } catch (error) {
      if (error?.code !== "E_PICKER_CANCELLED") console.error(error);
    }
  };

  const addImageFromCamera = async () => {
    try {
      const rawImage = await ImagePicker.openCamera({
        includeBase64: false,
        compressImageQuality: 0.8,
        cropping: false,
        includeExif: false,
      });

      if (rawImage) {
        if (rawImage.size > MAX_IMAGE_SIZE_BYTES) {
          Alert.alert(
            "Ogiltig bild",
            "Bilden som angivits är för stor. Den får max vara 7 Mb."
          );
        } else {
          addImagesToState([rawImage].map(transformRawImage));
        }
      }
    } catch (error) {
      if (error?.code !== "E_PICKER_CANCELLED") console.error(error);
    }
  };

  const validColorSchema = getValidColorSchema(colorSchema);
  return (
    <>
      <Wrapper>
        {images !== "" && (
          <ImageDisplay images={images} onChange={onChange} answers={answers} />
        )}
        <ButtonContainer>
          <Button
            colorSchema={validColorSchema}
            onClick={toggleModal}
            disabled={maxImages && images.length >= maxImages}
          >
            <Icon name="add" />
            <Text>
              {" "}
              {buttonText && buttonText !== "" ? buttonText : "Ladda upp bild"}
            </Text>
          </Button>
        </ButtonContainer>
      </Wrapper>

      <Modal
        visible={choiceModalVisible}
        hide={toggleModal}
        presentationStyle="overFullScreen"
        transparent
        animationType="fade"
      >
        <PopupContainer colorSchema={validColorSchema}>
          <Row>
            <PopupLabel colorSchema={validColorSchema}>
              Lägg till bild
            </PopupLabel>
            <TouchableOpacity onPress={toggleModal} activeOpacity={1}>
              <Icon name="clear" />
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
      </Modal>
    </>
  );
};

ImageUploader.propTypes = {
  buttonText: PropTypes.string,
  /** Array of image objects to initially populate the list with (i.e. meta-data including uris) */
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  onChange: PropTypes.func,
  colorSchema: PropTypes.oneOf(["blue", "red", "green", "purple", "neutral"]),
};

export default ImageUploader;
