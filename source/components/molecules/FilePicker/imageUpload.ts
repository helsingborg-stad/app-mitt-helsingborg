import { Alert, Linking } from "react-native";
import ImagePicker from "react-native-image-crop-picker";

import type {
  ImageOrVideo,
  PickerErrorCode,
} from "react-native-image-crop-picker";
import { splitFilePath } from "../../../helpers/FileUpload";

import type { File } from "./FilePicker.types";
import defaultFileStorageService from "../../../services/storage/fileStorage/FileStorageService";

interface ImageUploadError {
  code: PickerErrorCode;
}

const NO_IMAGE_UPLOAD_PERMISSION_CODES: PickerErrorCode[] = [
  "E_NO_CAMERA_PERMISSION",
  "E_NO_LIBRARY_PERMISSION",
];

const SKIP_WARNING_CODES: PickerErrorCode[] = ["E_PICKER_CANCELLED"];

const MAX_IMAGE_SIZE_BYTES = 7 * 1000 * 1000;

function showTooBigFileAlert() {
  Alert.alert(
    "Ogiltiga bilder",
    "Några av de angivna bilder är för stora. Varje bild får max vara 7 Mb."
  );
}

async function goToDeviceSettings() {
  await Linking.openSettings();
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

function handleUploadError(error: ImageUploadError) {
  if (NO_IMAGE_UPLOAD_PERMISSION_CODES.includes(error.code)) {
    showPermissionsAlert();
  } else if (!SKIP_WARNING_CODES.includes(error.code)) {
    console.error(error);
  }
}

async function createCacheFile(
  pick: ImageOrVideo,
  questionId: string
): Promise<File> {
  const path = pick.path ?? pick.sourceURL;
  const newId = await defaultFileStorageService.copyFileToCache(path);
  const name = pick.filename ?? splitFilePath(path).name;
  return {
    id: newId,
    deviceFileName: name,
    externalDisplayName: name,
    mime: pick.mime,
    questionId,
  };
}

export async function addImageFromCamera(questionId: string): Promise<File[]> {
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
        showTooBigFileAlert();
      } else {
        const createCacheFileWithQuestionId = (file: ImageOrVideo) =>
          createCacheFile(file, questionId);
        return Promise.all([rawImage].map(createCacheFileWithQuestionId));
      }
    }
  } catch (error) {
    handleUploadError(error as ImageUploadError);
  }
  return [];
}

export async function addImagesFromLibrary(
  questionId: string
): Promise<File[]> {
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

      const createCacheFileWithQuestionId = (file: ImageOrVideo) =>
        createCacheFile(file, questionId);
      return Promise.all(filteredImages.map(createCacheFileWithQuestionId));
    }
  } catch (error) {
    handleUploadError(error as ImageUploadError);
  }

  return [];
}
