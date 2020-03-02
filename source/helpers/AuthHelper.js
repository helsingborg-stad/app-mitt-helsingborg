import decode from 'jwt-decode';
import StorageService, { TOKEN_KEY, USER_KEY } from '../services/StorageService';

export default class AuthHelper {
  /**
   * Login user. Saves user and token to storage
   */
  static logIn = async (user, token) => {
    // Check if token is valid
    if (this.isTokenExpired(token)) {
      return false;
    }
    // Store user and token to async storage
    await StorageService.saveData(USER_KEY, user);
    await StorageService.saveData(TOKEN_KEY, token);

    return true;
  };

  /**
   * Clear access token
   */
  static logOut = async () => {
    await StorageService.removeData(TOKEN_KEY);
  };

  /**
   * Checks if there is a saved token and is still valid
   */
  static isAuthenticated = async () => {
    const token = await StorageService.getData(TOKEN_KEY);

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
  static getToken = async () => StorageService.getData(TOKEN_KEY);
}
