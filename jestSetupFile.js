import { NativeModules } from "react-native";
import "react-native-gesture-handler/jestSetup";

/**
 * Mock react-native-config (ENVS)
 */
jest.mock("react-native-config", () => ({
  // ...jest.requireActual('react-native-config-node'),
  // Override env variables for testing below

  // No base URL to prevent actual API calls
  // Targeting axios calls when mocking only requires endpoint
  MITTHELSINGBORG_IO: "",
  MITTHELSINGBORG_IO_APIKEY: "",
  FAKE_PERSONAL_NUMBER: "201111111111",
  FAKE_TOKEN:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
}));

/**
 * Async Storage
 */
jest.mock("@react-native-community/async-storage", () =>
  jest.requireActual(
    "@react-native-community/async-storage/jest/async-storage-mock"
  )
);

/**
 * Mock react-native-reanimated
 */
jest.mock("react-native-reanimated", () => {
  const Reanimated = jest.requireActual("react-native-reanimated/mock");

  // The mock for `call` immediately calls the callback which is incorrect
  // So we override it with a no-op
  Reanimated.default.call = () => {};

  return Reanimated;
});

/**
 * Mock NativeAnimatedHelper
 */
jest.mock("react-native/Libraries/Animated/NativeAnimatedHelper");

/**
 * Mock rn-fetch-blob
 */
jest.mock("rn-fetch-blob", () => ({
  DocumentDir: () => true,
}));

/**
 * Mock react-native-fs
 */
jest.mock("react-native-fs", () => ({
  mkdir: jest.fn(),
  moveFile: jest.fn(),
  copyFile: jest.fn(),
  pathForBundle: jest.fn(),
  pathForGroup: jest.fn(),
  getFSInfo: jest.fn(),
  getAllExternalFilesDirs: jest.fn(),
  unlink: jest.fn(),
  exists: jest.fn(),
  stopDownload: jest.fn(),
  resumeDownload: jest.fn(),
  isResumable: jest.fn(),
  stopUpload: jest.fn(),
  completeHandlerIOS: jest.fn(),
  readDir: jest.fn(),
  readDirAssets: jest.fn(),
  existsAssets: jest.fn(),
  readdir: jest.fn(),
  setReadable: jest.fn(),
  stat: jest.fn(),
  readFile: jest.fn(),
  read: jest.fn(),
  readFileAssets: jest.fn(),
  hash: jest.fn(),
  copyFileAssets: jest.fn(),
  copyFileAssetsIOS: jest.fn(),
  copyAssetsVideoIOS: jest.fn(),
  writeFile: jest.fn(),
  appendFile: jest.fn(),
  write: jest.fn(),
  downloadFile: jest.fn(),
  uploadFiles: jest.fn(),
  touch: jest.fn(),
  MainBundlePath: jest.fn(),
  CachesDirectoryPath: jest.fn(),
  DocumentDirectoryPath: jest.fn(),
  ExternalDirectoryPath: jest.fn(),
  ExternalStorageDirectoryPath: jest.fn(),
  TemporaryDirectoryPath: jest.fn(),
  LibraryDirectoryPath: jest.fn(),
  PicturesDirectoryPath: jest.fn(),
}));

/**
 * Mock storybook
 */
jest.mock("@storybook/react-native", () => ({
  getStorybookUI: jest.fn(),
  addDecorator: jest.fn(),
  configure: jest.fn(),
}));

/**
 * Mock react-native-background-timer
 */
jest.mock("react-native-background-timer", () => true);

/**
 * Mock react-native-document-picker
 */
jest.mock("react-native-document-picker", () => ({ default: jest.fn() }));

/**
 * Mock react-native datetimepicker
 */
NativeModules.RNDateTimePickerManager = {};

NativeModules.RNDateTimePickerManager.getDefaultDisplayValue = jest.fn(() =>
  Promise.resolve({
    determinedDisplayValue: "spinner",
  })
);
