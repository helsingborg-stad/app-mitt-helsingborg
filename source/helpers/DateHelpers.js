/**
 * Returns a string with the formatted updatedAt date, in format dd/mm-yyyy
 * @param {obj} caseObj
 * */
export const formatUpdatedAt = (updatedAt) => {
  if (updatedAt && updatedAt !== '') {
    const date = new Date(updatedAt);
    return `${date.getDate()}/${date.getMonth() + 1}-${date.getFullYear()}`;
  }
  return '';
};

/**
 * Capitalize first letter
 * @param {string} string
 */
const capitalizeFirstLetter = (string) =>
  string ? string.charAt(0).toUpperCase() + string.slice(1) : '';

/**
 * Returns the Swedish name of a month
 * @param {int} month
 */
export const getSwedishMonthName = (month) => {
  const months = [
    'januari',
    'februari',
    'mars',
    'april',
    'maj',
    'juni',
    'juli',
    'augusti',
    'september',
    'oktober',
    'november',
    'december',
  ];
  return months[parseInt(month) - 1];
};

/**
 * Returns the Swedish name of a month by timestamp
 * @param {int} month
 */
export const getSwedishMonthNameByTimeStamp = (timestamp, capitalized = false) => {
  const date = new Date(timestamp);
  if (!date) {
    return '';
  }
  const monthName = getSwedishMonthName(date.getMonth() + 1);

  return capitalized ? capitalizeFirstLetter(monthName) : monthName;
};
