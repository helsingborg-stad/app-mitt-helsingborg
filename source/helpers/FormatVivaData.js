/**
 * Returns negative amount with Swedish currency
 * @param {string} value
 */
const formatAmount = (value, negative = false) => {
  console.log('formatAmount', value);
  if (!value || typeof value !== 'string') {
    return '';
  }

  if (value === '0') {
    return `${value} kr`;
  }

  if (negative) {
    return `-${value.replace('-', '')} kr`;
  }

  return `${value} kr`;
};

/**
 * Wrap object in array if data is not already an array
 * (VIVA nonconsecutively returns arrays and objects)
 * @param {Object|string[]} data
 */
const convertDataToArray = (data) => (Array.isArray(data) ? data : [data]);

/**
 * Returns sum of multiple amounts with Swedish currency
 * @param {Object|string[]} amounts
 */
const calculateSum = (amounts) =>
  `${convertDataToArray(amounts).reduce(
    (acc, obj) => acc + parseInt(obj.approved || obj.amount),
    0
  )} kr`;

/**
 * Translate norm acronym to readable strings
 * @param {string} norm
 */
const translateNormAcronym = (norm) => {
  if (typeof norm !== 'string') {
    return norm;
  }
  switch (norm.toLowerCase()) {
    case 'h':
      return 'Heltid';
    case 'd':
      return 'Deltid';
    case 'u':
      return 'Umgängesbarn';
    default:
      return norm;
  }
};

export { formatAmount, calculateSum, convertDataToArray, translateNormAcronym };
