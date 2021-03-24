import { Step } from '../../../types/FormTypes';
import { User } from '../../../types/UserTypes';

/**
 * The first argument is the string that should be replaced,
 * the second should be something that we can use to compute the
 * replacement value, such as getting it from the user object,
 * or perhaps computing some dates based on the current time.
 */
const replacementRules = [
  ['#firstName', 'user.firstName'],
  ['#lastName', 'user.lastName'],
  ['#date-1', 'date.nextMonth.first'],
  ['#date-2', 'date.nextMonth.last'],
  ['#month-1', 'date.previousMonth.currentMonth-1'],
  ['#month-2', 'date.previousMonth.currentMonth-2'],
  ['#month+1', 'date.previousMonth.currentMonth+1'],
  ['#month+2', 'date.previousMonth.currentMonth+2'],
  ['#month', 'date.previousMonth.currentMonth'],
  ['#year', 'date.currentYear'], // this is the current year of next month
  ['#today', 'date.currentDate'], // this is the current year of next month
];

const swedishMonthTable = [
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

const replaceDates = (descriptor: string[]): string => {
  const today = new Date();

  if (descriptor[1] === 'nextMonth') {
    const month = today.getMonth() + 2;
    if (descriptor[2] === 'first') {
      return `1/${month}`;
    }
    if (descriptor[2] === 'last') {
      const days = new Date(today.getFullYear(), month, 0).getDate();
      return `${days}/${month}`;
    }
  }

  if (descriptor[1] === 'currentYear') {
    const year = new Date(today.getFullYear(), today.getMonth() + 1, 1).getFullYear();
    return `${year}`;
  }

  if (descriptor[1] === 'currentDate') {
    return `${today.getDate()}`;
  }

  if (descriptor[1] === 'previousMonth') {
    const currentMonth = today.getMonth();

    switch (descriptor[2]) {
      case 'currentMonth':
        return `${swedishMonthTable[currentMonth]}`;
      case 'currentMonth-1':
        return `${swedishMonthTable[currentMonth - 1]}`;
      case 'currentMonth-2':
        return `${swedishMonthTable[currentMonth - 2]}`;
      case 'currentMonth+1':
        return `${swedishMonthTable[currentMonth + 1]}`;
      case 'currentMonth+2':
        return `${swedishMonthTable[currentMonth + 2]}`;
      default:
        return `${swedishMonthTable[currentMonth]}`;
    }
  }
  return '';
};

const replaceUserInfo = (descriptor: string[], user: User): string => {
  const res = descriptor.slice(1).reduce((prev, current) => {
    if (prev && prev[current]) return prev[current];
    return undefined;
  }, user);
  return res || '';
};

const computeText = (descriptor: string, user: User): string => {
  const strArr = descriptor.split('.');
  if (strArr[0] === 'user') {
    return replaceUserInfo(strArr, user);
  }
  if (strArr[0] === 'date') {
    return replaceDates(strArr);
  }
  return '';
};

export const replaceText = (text: string, user: User) => {
  // This way of doing it might be a bit overkill, but the idea is that this in principle
  // allows for nesting replacement rules and then applying them in order one after the other.
  let res = text;
  replacementRules.forEach(([template, descriptor]) => {
    res = res.replace(template, computeText(descriptor, user));
  });
  return res;
};

/**
 * Replaces the markdown as specified by a set of markdown rules and logic that we've defined.
 * @param steps the steps of the form
 * @param user the user object
 */
export const replaceMarkdownTextInSteps = (steps: Step[], user: User): Step[] => {
  const newSteps = steps.map((step) => {
    if (step.questions) {
      step.questions = step.questions.map((qs) => {
        if (qs.label && qs.label !== '') {
          qs.label = replaceText(qs.label, user);
        }
        return qs;
      });
    }
    if (step.title) step.title = replaceText(step.title, user);
    if (step.description) step.description = replaceText(step.description, user);
    return step;
  });
  return newSteps;
};
