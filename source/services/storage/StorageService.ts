/**
 * Wrapper for AsyncStorage.
 * Keys should be placed in this file.
 *
 */

import { Component } from "react";
import AsyncStorage from "@react-native-community/async-storage";

interface IStorage {
  getData(key: string): Promise<string | null>;
  saveData(key: string, payload: string): Promise<void>;
}

// Storage key definitions
export const ONBOARDING_DISABLED = "@app:onboarding_disabled";
export const ACCESS_TOKEN_KEY = "@app:accessToken";
export const REFRESH_TOKEN_KEY = "@app:refreshToken";
export const TEMP_TOKEN_KEY = "@app:tempAccessToken";
export const USER_KEY = "@app:user";
export const ORDER_KEY = "@app:orderRef";
export const COMPLETED_FORMS_KEY = "@app:completedForms";
export const APP_ENV_KEY = "@app:appEnv";
export default class StorageService extends Component {
  /**
   * Get data from storage
   *
   * @param key
   * @returns {Promise}
   */
  static async getData(key) {
    return AsyncStorage.getItem(key).then((value) => {
      try {
        return JSON.parse(value);
      } catch (e) {
        return value;
      }
    });
  }

  static async getAll(): Promise<[string, string][]> {
    const allKeys: string[] = await AsyncStorage.getAllKeys();
    const allPairs: [string, string][] = await AsyncStorage.multiGet(allKeys);
    return allPairs;
  }

  /**
   * Save key value pair to storage.
   *
   * @param {String} key   The AsyncStorage key
   * @param {Object} value The AsyncStorage value
   * @returns {Promise}
   */
  static saveData(key, value) {
    return AsyncStorage.setItem(key, JSON.stringify(value));
  }

  /**
   * Save multiple values with key pair to storage.
   *
   * @param {String} key   The AsyncStorage key
   * @param {String} value The AsyncStorage value
   * @returns {Promise}
   */
  static multiSaveData(key, value) {
    return AsyncStorage.multiSet(key, value);
  }

  /**
   * Remove data from storage
   *
   * @param {String} key The AsyncStorage key
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

  /**
   * Add an item to array in local storage
   *
   * @param {String} key   The AsyncStorage key
   * @param {String} value The AsyncStorage value
   * @returns {Promise}
   */
  static async addDataToArray(key, value) {
    // Get the existing data
    const prevValue = await this.getData(key);
    // If no previous data exists, create an empty array
    const newValue = prevValue && Array.isArray(prevValue) ? prevValue : [];
    // Add new data to localStorage Array
    newValue.push(value);
    // Save back to localStorage
    return this.saveData(key, newValue);
  }

  /**
   * Add an item to object in local storage
   *
   * @param {String} key        The AsyncStorage key
   * @param {String} objectKey  The AsyncStorage value object key
   * @param {String} value      The AsyncStorage value
   * @returns {Promise}
   */
  static async addDataToObject(key, objectKey, value) {
    // Get the existing data
    const prevValue = await this.getData(key);
    // If no previous data exists, create an empty object
    const newValue =
      prevValue && typeof value === "object" && value !== null ? prevValue : {};
    // Add new data to localStorage Object
    newValue[objectKey] = value;
    // Save back to localStorage
    return this.saveData(key, newValue);
  }
}

export const wrappedDefaultStorage: IStorage = {
  async getData(key) {
    const data = await StorageService.getData(key);
    if (data) {
      return typeof data === "string" ? data : JSON.stringify(data);
    }
    return data;
  },
  async saveData(key, payload) {
    return StorageService.saveData(key, payload);
  },
};
