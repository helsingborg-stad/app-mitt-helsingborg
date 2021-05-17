import { Alert } from 'react-native';
import Config from 'react-native-config';
import RNRestart from 'react-native-restart';
import { string } from 'prop-types';

/**
 * Handler for boundary errors.
 * This handler shall take care of boundary errors in both storybook, app in dev mode and app in release mode
 * (run-xxx --configuration Release).
 * Set .env flag "ENABLE_DEV_ERROR_BOUNDARY=true" to enable boundary errors in dev mode (non release builds of app).
 *
 * Non-fatal errors are triggered by `console.error` calls.
 * Fatal errors are triggered by unhandled exceptions, and can also be triggered manually with `ErrorUtils.reportFatalError`.
 *
 * @param error Error object or error message string
 * @param isFatal True if error is deemed fatal and cannot be recovered from
 */
const boundaryErrorHandler = (error: undefined | string | Error, isFatal: boolean) => {
  const errorMessage = typeof error === 'string' ? error : error?.message || 'unknown error';

  if (error && isFatal) {
    console.log('boundary error', typeof error, error);

    if (Config.IS_STORYBOOK === 'true') {
      Alert.alert('Something went wrong in storybook', `${errorMessage}`, [{ text: 'OK' }]);
    } else {
      Alert.alert('Something went wrong in Mitt Helsingborg', `${errorMessage}`, [
        {
          text: 'Restart',
          onPress: () => {
            RNRestart.Restart();
          },
        },
      ]);
    }
  } else {
    // non-fatal errors go here
    // they are probably already logged to console so no need to log them again
  }

  // TODO: send error to analytics
};

export default boundaryErrorHandler;
