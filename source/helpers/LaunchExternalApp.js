import { Linking, Platform } from 'react-native';

/**
 * Triggers the native phone app
 * @param {string} phone
 */
export const launchPhone = phone => {
  console.log('TRIGGER launch phone app');

  let phoneNumber = phone;
  if (Platform.OS !== 'android') {
    phoneNumber = `telprompt:${phone}`;
  } else {
    phoneNumber = `tel:${phone}`;
  }
  Linking.canOpenURL(phoneNumber)
    .then(supported => {
      if (!supported) {
        console.log('Error: Failed to launch phone app');
      } else {
        return Linking.openURL(phoneNumber);
      }
    })
    .catch(err => console.log(err));
};

/**
 * Triggers the native email app
 * @param {string} email
 */
export const launchEmail = email => {
  console.log('TRIGGER launch email app');

  const mailto = `mailto:${email}`;
  Linking.canOpenURL(mailto)
    .then(supported => {
      if (!supported) {
        console.log('Error: Failed to launch email app');
      } else {
        return Linking.openURL(mailto);
      }
    })
    .catch(err => console.log(err));
};
