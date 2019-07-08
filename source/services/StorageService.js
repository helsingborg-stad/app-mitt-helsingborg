/**
 * Wrapper for AsyncStorage.
 * Keys should be placed in this file.
 *
 */

import React, { Component } from 'react'
import AsyncStorage from "@react-native-community/async-storage";

// Storage key definitions
export const USER_SETTINGS_SWITCH = "@app:user_settings_switch";    // Example, will be removed.

export default class StorageService extends Component {
    /**
     * Get data from storage
     *
     * @param key
     * @returns {Promise}
     */
    static getData(key) {
        return AsyncStorage.getItem(key).then(value => {
            return JSON.parse(value);
        })
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
}
