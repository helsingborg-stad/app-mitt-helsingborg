// TODO: remove this and restructure.
// This is mock data for now, it should come from elsewhere later on (i.e. the form, I think).
const formDataMap = {
  'a3165a20-ca10-11ea-a07a-7f5f78324df2': {
    personalInfo: {
      email: 'a3165a20-ca10-11ea-a07a-7f5f78324df2.personalInfo.email||user.email',
      telephone: 'user.mobilePhone',
    },
    housingInfo: {
      address: 'user.adress.street',
    },
  },
};

const sortCasesByLastUpdated = list => list.sort((a, b) => b.updatedAt - a.updatedAt);

const treeParseAcc = (obj, acc, parser) => {
  if (typeof obj === 'string') {
    return parser(obj);
  }
  const res = {};
  Object.keys(obj).forEach(key => {
    res[key] = treeParseAcc(obj[key], acc, parser);
  });
  return res;
};
const treeParse = (obj, parser) => treeParseAcc(obj, {}, parser);

const getUserInfo = (user, strArray) => strArray.reduce((prev, current) => prev[current], user);
const getCaseInfo = (c, strArray) => strArray.reduce((prev, current) => prev[current], c);

const generateParser = (user, cases) => str => {
  const orSplit = str.split('||');
  const parseArray = orSplit.map(str => {
    const strArray = str.split('.');
    if (strArray[0] === 'user') {
      return getUserInfo(user, strArray.slice(1));
    }

    const formId = strArray[0];
    const sortedCases = sortCasesByLastUpdated(cases);
    const latestRelevantCase = sortedCases.find(c => c.formId === formId);
    if (latestRelevantCase) {
      return getCaseInfo(latestRelevantCase.data, strArray.slice(1));
    }

    return undefined;
  });
  const result = parseArray.find(res => res);
  return result || '';
};

const generateInitialCase = (formId, user, cases) => {
  const caseArray = Array.isArray(cases) ? cases : Object.values(cases);
  if (formDataMap[formId]) {
    const parser = generateParser(user, caseArray);
    const initialCase = treeParse(formDataMap[formId], parser);
    return initialCase;
  }

  return {};
};

export default generateInitialCase;
