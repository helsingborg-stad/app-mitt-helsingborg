/**
 * Filter object propeties by keys. Can either include or exclude propeties.
 *
 * @param { object } object Target to filter
 * @param { array } keys Keys to include or exclude
 * @param { boolean } include Set to false to exclude propeties (instead of include)
 * @return { object }
 */
const filterPropetiesByKeys = (object = {}, keys = [], include = true) =>
  Object.entries(object).reduce((accumulator, [itemKey, itemValue]) => {
    const filteredObject = accumulator;
    if (
      (include === true && keys.includes(itemKey)) ||
      (include !== true && !keys.includes(itemKey))
    ) {
      filteredObject[itemKey] = itemValue;
    }

    return filteredObject;
  }, {});

/**
 * Filter an object to only include propeties with matching keys
 *
 * @param { object } object Target to filter
 * @param { array } keys Keys to include
 * @return { object }
 */
const includePropetiesWithKey = (object = {}, keys = []) =>
  filterPropetiesByKeys(object, keys);

/**
 * Filter an object to exclude propeties with matching keys
 *
 * @param { object } object Target to filter
 * @param { array } keys Keys to exclude
 * @return { object }
 */
const excludePropetiesWithKey = (object = {}, keys = []) =>
  filterPropetiesByKeys(object, keys, false);

/**
 * Changes the names for keys that matches a specific string.
 *
 * @param { object } object Target to change
 * @param { match } match String to match
 */
const renameMatchedKeysInObject = (obj = {}, match = "") => {
  Object.keys(obj).forEach((key) => {
    if (key.includes(match)) {
      const newObjectKey = key.replace(match, "");
      obj[newObjectKey] = obj[key];
      delete obj[key];
    }
  });

  return obj;
};

/**
 * Performs a deep merge of objects and returns new object. Does not modify
 * objects (immutable) and merges arrays via concatenation.
 *
 * @param {...object} objects - Objects to merge
 * @returns {object} New object with merged key/values
 */
const mergeDeep = (...objects) => {
  const isObject = (obj) => obj && typeof obj === "object";

  return objects.reduce((prev, obj) => {
    const prevCopy = { ...prev };

    Object.keys(obj).forEach((key) => {
      const pVal = prevCopy[key];
      const oVal = obj[key];

      if (Array.isArray(pVal) && Array.isArray(oVal)) {
        prevCopy[key] = pVal.concat(...oVal);
      } else if (isObject(pVal) && isObject(oVal)) {
        prevCopy[key] = mergeDeep(pVal, oVal);
      } else {
        prevCopy[key] = oVal;
      }
    });

    return prevCopy;
  }, {});
};

export {
  filterPropetiesByKeys,
  includePropetiesWithKey,
  excludePropetiesWithKey,
  renameMatchedKeysInObject,
  mergeDeep,
};
