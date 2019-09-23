/**
 * Wrapper for AsyncStorage.
 * Keys should be placed in this file.
 *
 */

import React, { Component } from 'react'
import AsyncStorage from "@react-native-community/async-storage";

// Storage key definitions
export const SHOW_SPLASH_SCREEN = '@app:show_splash_screen';
export const TOKEN_KEY = '@app:accessToken';

export default class StorageService extends Component {
    /**
     * Get data from storage
     *
     * @param key
     * @returns {Promise}
     */
    static async getData(key) {
        return await AsyncStorage.getItem(key).then(value => {
            try {
                return JSON.parse(value);
            }
            catch (e) {
                return value;
            }
        });
    }

    /**
     * Save key value pair to storage.
     *
     * @param key
     * @param value
     * @returns {Promise}
     */
    static saveData(key, value) {
        return AsyncStorage.setItem(key, JSON.stringify(value));
    }

    /**
     * Save multiple values with key pair to storage.
     *
     * @param key
     * @param value
     * @returns {Promise}
     */
    static multiSaveData(key, value) {
        return AsyncStorage.multiSet(key, value);
    }

    /**
     * Remove data from storage
     *
     * @param key
     * @returns {Promise}
     */
    static removeData(key) {
        return AsyncStorage.removeItem(key);
    }
}
