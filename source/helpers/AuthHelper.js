import decode from "jwt-decode";
import StorageService from './../services/StorageService';

const USERKEY = 'user';
const TOKENKEY = 'accessToken';

export default class AuthHelper {

    /**
     * Login user. Saves user and token to storage
     */
    static logIn = async (user, token) => {
        return new Promise(async (resolve, reject) => {
            // Check if token is valid
            if (this.isTokenExpired(token)) {
                reject();
            }

            // Store user data
            const data = [
                [USERKEY, JSON.stringify(user)],
                [TOKENKEY, token],
            ];

            return await StorageService.multiSaveData(data)
                .then(() => resolve())
                .catch(() => reject());
        });
    };

    /**
     * Clear access token
     */
    static logOut = async () => {
        await StorageService.removeData(TOKENKEY);
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
            } else return true;
        } catch (err) {
            console.log("Token is expired!");
            return true;
        }
    };

    /**
     * Retrieves the access token from async storage
     */
    static getToken = async () => {
        return await StorageService.getData(TOKENKEY);
    };

    /**
    * Check if user exist in store
    */
    static confirmUser = () => {
        return new Promise(async (resolve, reject) => {
            const user = await StorageService.getData(USERKEY);
            if (typeof user === 'undefined' || user === null) {
                reject();
            }

            resolve();
        });
    }
}
