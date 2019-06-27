import { Linking } from 'react-native';

/**
 * Test if URL can be opened
 */
export const canOpenUrl = (url) => {
    return Linking.canOpenURL(url)
        .then((supported) => {
            if (supported) {
                return true;
            } else {
                return false;
            }
        })
        .catch((err) => {
            console.error('An error occurred', err);
            return false;
        });
}
