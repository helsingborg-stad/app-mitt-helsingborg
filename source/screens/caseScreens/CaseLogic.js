// Not sure this should be here... we have to decide where to put it.
// Doesn't necessarily need to be dynamic, since adding a new service
// will mean adding a few custom screens.
export const caseTypes = [
  {
    name: 'Ekonomiskt Bistånd',
    forms: ['a3165a20-ca10-11ea-a07a-7f5f78324df2', 'a0feda30-e86c-11ea-b20a-f72e709dacd1'],
    icon: 'ICON_EKB',
    navigateTo: 'EKBCases',
  },
  {
    name: 'Borgerlig Vigsel',
    forms: [],
    icon: '',
    navigateTo: 'BVCases',
  },
];

/** An enum for describing the state of the user with respect to a given case type. */
export const Status = {
  unfinished: 'UNFINISHED',
  unfinishedNoCompleted: 'UNFINISHED_NO_COMPLETED',
  recentlyCompleted: 'RECENTLY_COMPLETED',
  untouched: 'UNTOUCHED',
  onlyOldCases: 'ONLY_OLD_CASES',
};
const oldCaseLimit = 4 * 30 * 24 * 60 * 60 * 1000; // cases older than 4 months are classified as old.

/**
 * Takes a typeCase and an array of cases and returns [status, latestCase, relevantCases].
 * @param {*} caseType an object with {name, forms: [formIds], icon: icon name, navigateTo: string with the navigation path}.
 * @param {*} cases array of case objects.
 */
export const getCaseTypeAndLatestCase = (caseType, cases) => {
  let latestUpdated = 0;
  let latestCase;
  const relevantCases = [];
  cases.forEach(c => {
    if (caseType.forms.includes(c.formId)) {
      relevantCases.push(c);
      if (c.updatedAt > latestUpdated) {
        latestUpdated = c.updatedAt;
        latestCase = c;
      }
    }
  });
  if (latestUpdated === 0) {
    return [Status.untouched, undefined, relevantCases];
  }
  if (latestCase.status === 'ongoing' && relevantCases.length === 1) {
    return [Status.unfinishedNoCompleted, latestCase, relevantCases];
  }
  if (latestCase.status === 'ongoing') {
    return [Status.unfinished, latestCase, relevantCases];
  }
  if (latestCase.status === 'submitted') {
    if (Date.now() - latestUpdated > oldCaseLimit) {
      return [Status.onlyOldCases, latestCase, relevantCases];
    }
    return [Status.recentlyCompleted, latestCase, relevantCases];
  }
};

/** Returns a string with the formatted updatedAt date, in format dd/mm-yyyy */
export const getFormattedUpdatedDate = caseObj => {
  const date = new Date(caseObj.updatedAt);
  return `${date.getDate()}/${date.getMonth() + 1}-${date.getFullYear()}`;
};
