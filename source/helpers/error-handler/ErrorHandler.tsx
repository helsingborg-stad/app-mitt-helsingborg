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
 * @param error Object with error message
 */
const boundaryErrorHandler = (error = { message: string }) => {
  if (Config.IS_STORYBOOK === 'true') {
    Alert.alert('Something went wrong in storybook', `${error.message}`, [{ text: 'OK' }]);
  } else {
    Alert.alert('Something went wrong in Mitt Helsingborg', `${error.message}`, [
      {
        text: 'Restart',
        onPress: () => {
          RNRestart.Restart();
        },
      },
    ]);
  }
};

export default boundaryErrorHandler;
