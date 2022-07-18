import stringify from "json-stable-stringify";
import { NativeModules } from "react-native";

import _cloneDeep from "lodash.clonedeep";

const { Aes } = NativeModules;

export function deepCopyViaJson<T>(original: T): T {
  return JSON.parse(JSON.stringify(original)) as T;
}

/**
 * Deep copies objects and arrays, doesn't clone functions
 * This is just an alias of just-clone, so in the case we ever need to change this, we don't have to do it at 4 billion places.
 * @see https://www.npmjs.com/package/just-clone
 * @param original The object to copy
 * @returns The copied object
 */
export function deepCopy<T extends Record<any, any>>(original: T): T {
  return _cloneDeep(original);
}

export function filterAsync<T>(
  data: T[],
  predicate: (value: T, index: number, array: T[]) => Promise<boolean>
): Promise<T[]> {
  return data.reduce(async (pendingValues, value, index, array) => {
    const values = await pendingValues;
    const shouldInclude = await predicate(value, index, array);
    const newValues = shouldInclude ? [...values, value] : values;
    return newValues;
  }, Promise.resolve([] as T[]));
}

export async function deepCompareEquals(
  first: unknown,
  second: unknown
): Promise<boolean> {
  const firstJson = stringify(first);
  const firstHash = await Aes.sha1(firstJson);

  const secondJson = stringify(second);
  const secondHash = await Aes.sha1(secondJson);

  return firstHash === secondHash;
}

/**
 * @param i any variable
 */
export const isObject = (i: any): i is Record<string, unknown> =>
  !!i && i.constructor === Object;
