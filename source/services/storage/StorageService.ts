import { Component } from "react";
import AsyncStorage from "@react-native-community/async-storage";

export interface IStorage {
  getData(key: string): Promise<string | null>;
  saveData(key: string, payload: string): Promise<void>;
}

// Storage key definitions
export const ONBOARDING_DISABLED = "@app:onboarding_disabled";
export const ACCESS_TOKEN_KEY = "@app:accessToken";
export const REFRESH_TOKEN_KEY = "@app:refreshToken";
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
        return JSON.parse(value as string);
      } catch (e) {
        return value;
      }
    });
  }

  static async getAll(): Promise<[string, string | null][]> {
    const allKeys: string[] = await AsyncStorage.getAllKeys();
    const allPairs: [string, string | null][] = await AsyncStorage.multiGet(
      allKeys
    );
    return allPairs;
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
