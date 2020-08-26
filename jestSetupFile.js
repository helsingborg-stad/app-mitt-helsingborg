import { NativeModules } from 'react-native';

/**
 * Async Storage
 */
jest.mock('@react-native-community/async-storage', () =>
  jest.requireActual('@react-native-community/async-storage/jest/async-storage-mock')
);

/**
 * Mock react-native-reanimated
 */
jest.mock('react-native-reanimated', () => {
  const Reanimated = jest.requireActual('react-native-reanimated/mock');

  // The mock for `call` immediately calls the callback which is incorrect
  // So we override it with a no-op
  Reanimated.default.call = () => {};

  return Reanimated;
});

/**
 * Mock react-native-image-picker
 */
NativeModules.ImagePickerManager = {
  showImagePicker: jest.fn(),
  launchCamera: jest.fn(),
  launchImageLibrary: jest.fn(),
};

/**
 * Mock react-native datetimepicker
 */
NativeModules.RNDateTimePickerManager = {};

NativeModules.RNDateTimePickerManager.getDefaultDisplayValue = jest.fn(() =>
  Promise.resolve({
    determinedDisplayValue: 'spinner',
  })
);
