/**
 * Filter object propeties by keys. Can either include or exclude propeties.
 * 
 * @param { object } object Target to filter
 * @param { array } keys Keys to include or exclude
 * @param { boolean } include Set to false to exclude propeties (instead of include)
 * @return { object }
 */
const filterPropetiesByKeys = (object = {}, keys = [], include = true) => (
    Object.entries(object)
    .reduce((accumulator, [itemKey, itemValue]) => {
        let filteredObject = accumulator;
        if (include === true && keys.includes(itemKey) || include !== true && !keys.includes(itemKey)) {
            filteredObject[itemKey] = itemValue;
        }

        return filteredObject;
    }, {})
);

/**
 * Filter an object to only include propeties with matching keys
 * 
 * @param { object } object Target to filter
 * @param { array } keys Keys to include
 * @return { object }
 */
const includePropetiesWithKey = (object = {}, keys = []) => (filterPropetiesByKeys(object, keys));

/**
 * Filter an object to exclude propeties with matching keys
 * 
 * @param { object } object Target to filter
 * @param { array } keys Keys to exclude
 * @return { object }
 */
const excludePropetiesWithKey = (object = {}, keys = []) => (filterPropetiesByKeys(object, keys, false));

export { filterPropetiesByKeys, includePropetiesWithKey, excludePropetiesWithKey };