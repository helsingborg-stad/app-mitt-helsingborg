import { Alert } from 'react-native';
import Config from 'react-native-config';
import RNRestart from 'react-native-restart';
import { string } from 'prop-types';

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
