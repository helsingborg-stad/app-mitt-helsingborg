/**
 * 
 * @param { value }
 * @return { array }
 */
const convertToArray = (value)  => {
    const array = Array.isArray(value) ? value : [value];
    return array
}

export {convertToArray}