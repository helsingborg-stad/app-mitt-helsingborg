/**
 * Wrapper for AsyncStorage.
 * Keys should be placed in this file.
 *
 */

import { Component } from "react";
import AsyncStorage from "@react-native-community/async-storage";
import type { IStorage } from "./encryption";

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
  static async getData(key: string): Promise<string | null> {
    return AsyncStorage.getItem(key).then((value) => {
      try {
        return value ? JSON.parse(value) : value;
      } catch (e) {
        return value;
      }
    });
  }

  /**
   * Save key value pair to storage.
   *
   * @param {String} key   The AsyncStorage key
   * @param {Object} value The AsyncStorage value
   * @returns {Promise}
   */
  static saveData(key: string, value: unknown): Promise<void> {
    return AsyncStorage.setItem(key, JSON.stringify(value));
  }

  /**
   * Remove data from storage
   *
   * @param {String} key The AsyncStorage key
   * @returns {Promise}
   */
  static removeData(key: string): Promise<void> {
    return AsyncStorage.removeItem(key);
  }

  /**
   * Remove all data from storage
   *
   * @returns {Promise}
   */
  static clearData(): Promise<void> {
    return AsyncStorage.clear();
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
