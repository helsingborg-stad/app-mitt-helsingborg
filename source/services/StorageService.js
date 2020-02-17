/* eslint-disable no-unused-vars */
/* eslint-disable no-shadow */
/* eslint-disable no-return-await */
/**
 * Wrapper for AsyncStorage.
 * Keys should be placed in this file.
 *
 */

import React, { Component } from 'react';
import AsyncStorage from '@react-native-community/async-storage';

// Storage key definitions
export const SHOW_SPLASH_SCREEN = '@app:show_splash_screen';
export const TOKEN_KEY = '@app:accessToken';
export const TEMP_TOKEN_KEY = '@app:tempAccessToken';
export const USER_KEY = '@app:user';
export const ORDER_KEY = '@app:orderRef';
export const COMPLETED_FORMS_KEY = '@app:completedForms';

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
      } catch (e) {
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
   * Put new data to array with key value pair to storage.
   *
   * @param key
   * @param value
   * @returns {Promise}
   */
  static putData(key, value) {
    return AsyncStorage.getItem(key, (err, result) => {
      if (result !== null) {
        let newValue = [];
        if (Array.isArray(value)) {
          newValue = JSON.parse(result).concat(value);
        } else if (typeof value === 'object' && value !== null) {
          newValue = JSON.parse(result);
          newValue.push(value);
        }

        return AsyncStorage.setItem(key, JSON.stringify(newValue));
      }
      const newValue = Array.isArray(value) ? value : [value];
      return AsyncStorage.setItem(key, JSON.stringify(newValue));
    });
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

  /**
   * Remove all data from storage
   *
   * @returns {Promise}
   */
  static clearData() {
    return AsyncStorage.clear();
  }
}
