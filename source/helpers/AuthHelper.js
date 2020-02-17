import decode from 'jwt-decode';
import StorageService, { TOKEN_KEY, USER_KEY } from '../services/StorageService';

export default class AuthHelper {
  /**
   * Login user. Saves user and token to storage
   */
  static logIn = async (user, token) =>
    new Promise(async (resolve, reject) => {
      // Check if token is valid
      if (this.isTokenExpired(token)) {
        reject();
      }

      // Store user data
      const data = [
        [USER_KEY, JSON.stringify(user)],
        [TOKEN_KEY, token],
      ];

      return await StorageService.multiSaveData(data)
        .then(() => resolve())
        .catch(() => reject());
    });

  /**
   * Clear access token
   */
  static logOut = async () => {
    await StorageService.removeData(TOKEN_KEY);
  };

  /**
   * Checks if there is a saved token and is still valid
   */
  static loggedIn = async () => {
    const token = await this.getToken();

    return !!token && !this.isTokenExpired(token);
  };

  /**
   * Check if token is expired
   */
  static isTokenExpired = token => {
    try {
      const decoded = decode(token);
      if (decoded.exp > Math.floor(Date.now() / 1000)) {
        return false;
      }
      return true;
    } catch (err) {
      console.log('Token is expired!');
      return true;
    }
  };

  /**
   * Retrieves the access token from async storage
   */
  static getToken = async () => await StorageService.getData(TOKEN_KEY);

  /**
   * Check if user exist in store
   */
  static confirmUser = () =>
    new Promise(async (resolve, reject) => {
      const user = await StorageService.getData(USER_KEY);
      if (typeof user === 'undefined' || user === null) {
        reject();
      }

      resolve();
    });
}
