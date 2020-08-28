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

export const Status = {
  unfinished: 'UNFINISHED',
  unfinishedNoCompleted: 'UNFINISHED_NO_COMPLETED',
  recentlyCompleted: 'RECENTLY_COMPLETED',
  untouched: 'UNTOUCHED',
  onlyOldCases: 'OLD_CASES',
};
const oldCase = 4 * 30 * 24 * 60 * 60 * 1000; // cases older than 4 months are classified as old.

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
    if (Date.now() - latestUpdated > oldCase) {
      return [Status.onlyOldCases, latestCase, relevantCases];
    }
    return [Status.recentlyCompleted, latestCase, relevantCases];
  }
};

export const getFormattedUpdatedDate = caseObj => {
  const date = new Date(caseObj.updatedAt);
  return `${date.getDate()}/${date.getMonth() + 1}-${date.getFullYear()}`;
};
