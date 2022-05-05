import { Alert } from "react-native";
import ImagePicker, { ImageOrVideo } from "react-native-image-crop-picker";
import uuid from "react-native-uuid";

import { AllowedFileTypes } from "../../../helpers/FileUpload";
import { Image } from "../ImageDisplay/ImageDisplay";

const MAX_IMAGE_SIZE_BYTES = 7 * 1000 * 1000;

interface HookResponse {
  addImagesFromLibrary: (questionid: string) => Promise<Image[]>;
  addImageFromCamera: (questionId: string) => Promise<Image[]>;
}
export default (): HookResponse => {
  const transformRawImage = (
    rawImage: ImageOrVideo,
    questionId: string
  ): Image => ({
    questionId,
    path: rawImage.path,
    filename: rawImage?.filename,
    width: rawImage.width,
    height: rawImage.height,
    size: rawImage.size,
    fileType: (rawImage.path as string).split(".").pop() as AllowedFileTypes,
    id: uuid.v4() as string,
    mime:
      rawImage?.filename?.split(".")?.pop() ??
      (rawImage.path?.split(".")?.pop() as string),
  });

  const addImageFromCamera = async (questionId: string) => {
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
          return [rawImage].map((image) =>
            transformRawImage(image, questionId)
          );
        }
      }
    } catch (error) {
      if (error?.code !== "E_PICKER_CANCELLED") console.error(error);
    }
    return [];
  };

  const addImagesFromLibrary = async (questionId: string) => {
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

        return filteredImages.map((image) =>
          transformRawImage(image, questionId)
        );
      }
    } catch (error) {
      if (error?.code !== "E_PICKER_CANCELLED") console.error(error);
    }

    return [];
  };

  return {
    addImagesFromLibrary,
    addImageFromCamera,
  };
};
