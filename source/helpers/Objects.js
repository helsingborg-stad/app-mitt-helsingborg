/**
 * 
 * @param { object } object 
 * @param { array } keys 
 * @return { object }
 */
const filterPropetiesByKeys = (object = {}, keys = []) => (
    Object.entries(object)
    .reduce((accumulator, [itemKey, itemValue]) => {
        let filteredObject = accumulator;
        if (keys.includes(itemKey)) {
            filteredObject[itemKey] = itemValue;
        }

        return filteredObject;
    }, {})
);

export { filterPropetiesByKeys };