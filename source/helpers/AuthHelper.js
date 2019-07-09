import decode from "jwt-decode";
import StorageService from './../services/StorageService';

const USERKEY = 'user';
const TOKENKEY = 'accessToken';

export default class AuthHelper {

    // login = (username, password) => {
    //     // Get a token from api server using the fetch api
    //     return this.fetch(`/log-in`, {
    //         method: "POST",
    //         body: JSON.stringify({
    //             username,
    //             password
    //         })
    //     }).then(res => {
    //         this.setToken(res.token); // Setting the token in localStorage
    //         return Promise.resolve(res);
    //     });
    // };

    static loggedIn = async () => {
        // Checks if there is a saved token and it's still valid
        const token = await this.getToken(); // Getting token from localstorage
        console.log("has token", !!token);
        console.log("loggedIn token", token);
        console.log("isTokenExpired", this.isTokenExpired(token));
        return !!token && !this.isTokenExpired(token); // handwaiving here
    };

    static isTokenExpired = token => {
        try {
            const decoded = decode(token);
            if (decoded.exp < Date.now() / 1000) {
                // Checking if token is expired.
                return true;
            } else return false;
        } catch (err) {
            console.log("Token is expired!");
            return false;
        }
    };

    // /**
    //  * Saves user token to localStorage
    //  */
    // setToken = idToken => {
    //     localStorage.setItem("id_token", idToken);
    // };

    /**
     * Retrieves the access token from async storage
     */
    static getToken = async () => {
        return await StorageService.getData(TOKENKEY);
    };

    /**
     * Clear user token and profile data from localStorage
     */
    static logout = async () => {
        await StorageService.removeData(TOKENKEY);
    };

    /**
    * Try to get stored user and resolve promise
    */
    static confirmUser = () => {
        return new Promise(async (resolve, reject) => {
            const user = await StorageService.getData(USERKEY);
            console.log("THA USER", user);

            if (typeof user === 'undefined' || user === null) {
                reject();
            }

            resolve();
        });
    }
}
