const filterPropetiesByKeys = (object = {}, keys = []) => (
    Object.entries(object)
    .reduce((accumulator, [itemKey, itemValue]) => {
        let optionsObject = accumulator;
        if (keys.includes(itemKey)) {
            optionsObject[itemKey] = itemValue;
        }

        return optionsObject;
    }, {})
);

export {filterPropetiesByKeys};