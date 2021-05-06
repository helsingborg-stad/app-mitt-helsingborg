import { NativeModules } from 'react-native';

/**
 * Mock react-native-config (ENVS)
 */
jest.mock('react-native-config', () => ({
  // ...jest.requireActual('react-native-config-node'),
  // Override env variables for testing below

  // No base URL to prevent actual API calls
  // Targeting axios calls when mocking only requires endpoint
  MITTHELSINGBORG_IO: '',
  MITTHELSINGBORG_IO_APIKEY: '',
  FAKE_PERSONAL_NUMBER: '201111111111',
  FAKE_TOKEN:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
}));

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
 * Mock NativeAnimatedHelper
 */
jest.mock('react-native/Libraries/Animated/src/NativeAnimatedHelper');

/**
 * Mock react-native datetimepicker
 */
NativeModules.RNDateTimePickerManager = {};

NativeModules.RNDateTimePickerManager.getDefaultDisplayValue = jest.fn(() =>
  Promise.resolve({
    determinedDisplayValue: 'spinner',
  })
);
