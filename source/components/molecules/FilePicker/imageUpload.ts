import { Alert, Linking, Platform } from "react-native";
import ImagePicker from "react-native-image-crop-picker";
import uuid from "react-native-uuid";

import type {
  ImageOrVideo,
  PickerErrorCode,
} from "react-native-image-crop-picker";
import { splitFilePath } from "../../../helpers/FileUpload";

import type { AllowedFileTypes } from "../../../helpers/FileUpload";
import type { Image } from "../ImageDisplay/ImageDisplay";

interface ImageUploadError {
  code: PickerErrorCode;
}

const NO_IMAGE_UPLOAD_PERMISSION_CODES = [
  "E_NO_CAMERA_PERMISSION",
  "E_NO_LIBRARY_PERMISSION",
];

const MAX_IMAGE_SIZE_BYTES = 7 * 1000 * 1000;

function showToBigFileAlert() {
  Alert.alert(
    "Ogiltiga bilder",
    "Några av de angivna bilder är för stora. Varje bild får max vara 7 Mb."
  );
}

async function goToDeviceSettings() {
  if (Platform.OS === "android") {
    await Linking.openSettings();
  }

  if (Platform.OS === "ios") {
    await Linking.openURL("app-settings:MittHelsingborg");
  }
}

function showPermissionsAlert() {
  Alert.alert(
    "Tillåtelse",
    "Mitt Helsingborg behöver din tillåtelse för att kunna lägga till bilder och filer från din enhet. Gå till inställningar för att ge tillåtelse.",
    [
      {
        text: "Avbryt",
        style: "cancel",
      },
      {
        text: "Inställningar",
        onPress: goToDeviceSettings,
        style: "default",
      },
    ]
  );
}

function transformRawImage(rawImage: ImageOrVideo, questionId: string): Image {
  const filename =
    splitFilePath(rawImage.path).nameWithExt ?? rawImage?.filename;

  return {
    questionId,
    path: rawImage.path,
    filename,
    displayName: filename,
    width: rawImage.width,
    height: rawImage.height,
    size: rawImage.size,
    fileType: (rawImage.path as string).split(".").pop() as AllowedFileTypes,
    id: uuid.v4() as string,
    mime:
      rawImage?.filename?.split(".")?.pop() ??
      (rawImage.path?.split(".")?.pop() as string),
  };
}

function handleUploadError(error: ImageUploadError) {
  if (NO_IMAGE_UPLOAD_PERMISSION_CODES.includes(error.code)) {
    showPermissionsAlert();
  } else {
    console.error(error);
  }
}

export async function addImageFromCamera(questionId: string): Promise<Image[]> {
  try {
    const rawImage = await ImagePicker.openCamera({
      includeBase64: false,
      compressImageQuality: 0.8,
      cropping: false,
      includeExif: false,
      forceJpg: true,
    });

    if (rawImage) {
      if (rawImage.size > MAX_IMAGE_SIZE_BYTES) {
        showToBigFileAlert();
      } else {
        return [rawImage].map((image) => transformRawImage(image, questionId));
      }
    }
  } catch (error) {
    handleUploadError(error as ImageUploadError);
  }
  return [];
}

export async function addImagesFromLibrary(
  questionId: string
): Promise<Image[]> {
  try {
    const rawImages = await ImagePicker.openPicker({
      multiple: true,
      mediaType: "photo",
      includeBase64: false,
      compressImageQuality: 0.8,
      writeTempFile: true,
      cropping: false,
      includeExif: false,
      forceJpg: true,
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
    handleUploadError(error as ImageUploadError);
  }

  return [];
}
