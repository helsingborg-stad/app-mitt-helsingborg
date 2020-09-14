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
];

const computeText = (descriptor: string, user: User): string => {
  const strArr = descriptor.split('.');
  if (strArr[0] === 'user') {
    const res = strArr.slice(1).reduce((prev, current) => {
      if (prev && prev[current]) return prev[current];
      return undefined;
    }, user);
    if (res) return res;
  }
  return '';
};

const replaceText = (text: string, user: User) => {
  let res = text;
  replacementRules.forEach(([template, descriptor]) => {
    res = res.replace(template, computeText(descriptor, user));
  });
  return res;
};

export const replaceMarkdownTextInSteps = (steps: Step[], user: User): Step[] => {
  const newSteps = steps.map(step => {
    if (step.questions) {
      step.questions = step.questions.map(qs => {
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
