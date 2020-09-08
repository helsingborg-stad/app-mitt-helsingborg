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

/** An enum for describing the state of the user with respect to a given case type. */
export const Status = {
  unfinished: 'UNFINISHED',
  unfinishedNoCompleted: 'UNFINISHED_NO_COMPLETED',
  recentlyCompleted: 'RECENTLY_COMPLETED',
  untouched: 'UNTOUCHED',
  onlyOldCases: 'ONLY_OLD_CASES',
};
const oldCaseLimit = 4 * 30 * 24 * 60 * 60 * 1000; // cases older than 4 months are classified as old.

const getIds = async (formTypes, findFormByType) =>
  formTypes.map(async type => {
    const formSummary = await findFormByType(type);
    return formSummary.id;
  });

/**
 * Takes a typeCase and an array of cases and returns [status, latestCase, relevantCases].
 * @param {obj} caseType an object with {name, forms: [formIds], icon: icon name, navigateTo: string with the navigation path}.
 * @param {[cases]} cases array of case objects.
 */
export const getCaseTypeAndLatestCase = async (caseType, cases, findFormByType) => {
  let latestUpdated = 0;
  let latestCase;
  const relevantCases = [];

  const idPromises = await getIds(caseType.formTypes, findFormByType);
  const formIds = [];
  await Promise.all(idPromises).then(ids => {
    ids.forEach(id => formIds.push(id));
  });

  cases.forEach(c => {
    if (formIds.includes(c.formId)) {
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
