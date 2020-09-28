/**
 * Returns a string with the formatted updatedAt date, in format dd/mm-yyyy
 * @param {obj} caseObj
 * */
export const formatUpdatedAt = updatedAt => {
  if (updatedAt && updatedAt !== '') {
    const date = new Date(updatedAt);
    return `${date.getDate()}/${date.getMonth() + 1}-${date.getFullYear()}`;
  }
  return '';
};
