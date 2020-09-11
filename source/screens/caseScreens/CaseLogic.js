// Not sure this should be here... we have to decide where to put it.
// Doesn't necessarily need to be dynamic, since adding a new service
// will mean adding a few custom screens.
export const caseTypes = [
  {
    name: 'Ekonomiskt Bistånd',
    formTypes: ['EKB-recurring', 'EKB-new'],
    icon: 'ICON_EKB',
    navigateTo: 'EKBCases',
  },
  {
    name: 'Borgerlig Vigsel',
    formTypes: [],
    icon: '',
    navigateTo: 'BVCases',
  },
];

/**
 * Returns a string with the formatted updatedAt date, in format dd/mm-yyyy
 * @param {obj} caseObj
 * */
export const getFormattedUpdatedDate = caseObj => {
  if (caseObj?.updatedAt && caseObj.updatedAt !== '') {
    const date = new Date(caseObj.updatedAt);
    return `${date.getDate()}/${date.getMonth() + 1}-${date.getFullYear()}`;
  }
  return '';
};
