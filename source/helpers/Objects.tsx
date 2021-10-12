import stringify from "json-stable-stringify";
import { NativeModules } from "react-native";

const { Aes } = NativeModules;

export function deepCopyViaJson<T>(original: T): T {
  return JSON.parse(JSON.stringify(original)) as T;
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
