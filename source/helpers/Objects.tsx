export default function deepCopyViaJson<T>(original: T): T {
  return JSON.parse(JSON.stringify(original)) as T;
}
