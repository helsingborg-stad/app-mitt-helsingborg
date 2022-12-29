/**
 * Returns negative amount with Swedish currency
 * @param {string} value
 */
const formatAmount = (value: unknown, negative = false): string => {
  if (!value || typeof value !== "string") {
    return "";
  }

  if (value === "0") {
    return `${value} kr`;
  }

  if (negative) {
    return `-${value.replace("-", "")} kr`;
  }

  return `${value} kr`;
};

/**
 * Wrap object in array if data is not already an array
 * (VIVA nonconsecutively returns arrays and objects)
 * @param {Object|string[]} data
 */
const convertDataToArray = (data) =>
  Array.isArray(data) ? data : [data].filter(Boolean);

/**
 * Returns sum of multiple amounts with Swedish currency
 * @param {Object|string[]} amounts
 */
const calculateSum = (amounts, suffix = "kr"): string =>
  `${convertDataToArray(amounts).reduce(
    (acc, obj) => acc + parseInt(obj.approved || obj.amount, 10),
    0
  )} ${suffix}`;

export { formatAmount, calculateSum, convertDataToArray };
