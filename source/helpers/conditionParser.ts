import { Question, SummaryItem } from '../types/FormTypes';

const evaluateSummaryList = (
  answers: Record<string, any>,
  items: SummaryItem[]
): boolean => {
  if (!Array.isArray(items)) {
    return false;
  }
  let isEmpty = true;
  items.forEach((item) => {
    if (!isEmpty) return;

    if (['text', 'number', 'date', 'checkbox'].includes(item.type)) {
      if (answers[item.id] && answers[item.id] !== '') isEmpty = false;
    }
    if (['arrayText', 'arrayNumber', 'arrayDate'].includes(item.type)) {
      if (answers[item.id] && Array.isArray(answers[item.id]) && answers[item.id].length > 0) {
        (answers[item.id] as string[]).forEach(a => { if (a && a !== '') isEmpty = false; })
      }
    }
  });
  return !isEmpty;
};

/** Evaluates an answer value to a boolean. False if the value is empty or false, otherwise true. */
export const evaluateAnswer = (
  questionId: string,
  answers: Record<string, any>,
  questions: Question[]
): boolean => {
  const question = questions.find((q) => q.id === questionId);
  if (!question) return false;

  switch (question.type) {
    case 'checkbox':
      if (answers[questionId]) return answers[questionId];
      return false;
    case 'text':
    case 'number':
    case 'date':
      return (answers[questionId] && answers[questionId] !== '');
    case 'editableList':
      return (
        answers[questionId] &&
        Object.keys(answers[questionId]).filter(
          (key) => answers[questionId][key] && answers[questionId][key] !== ''
        ).length > 0
      );
    case 'repeaterField':
      return (answers[questionId] && answers[questionId].length > 0);
    case 'summaryList':
      return evaluateSummaryList(answers, question.items || []);
    default:
      return false;
  }
};

type EvaluatedValue = boolean | '!' | '&&' | '||';

// evaluation functions
const evaluateNot = (array: EvaluatedValue[]): EvaluatedValue[] => {
  const arrCopy = [...array];
  const reversedIndex = arrCopy.reverse().findIndex(expr => expr === '!');
  if (reversedIndex === -1) return array;
  
  const index = arrCopy.length - reversedIndex - 1;
  arrCopy.reverse()[index+1] = !arrCopy[index+1];
  arrCopy.splice(index,1);
  return evaluateNot(arrCopy);
};
const evaluateAnd = (array: EvaluatedValue[]): EvaluatedValue[] => {
  const arrCopy = [...array];
  const index = arrCopy.findIndex(expr => expr === '&&');
  if (index === -1) return array;
  
  arrCopy[index-1] = (array[index-1] && array[index+1]) as EvaluatedValue;
  arrCopy.splice(index,2);
  return evaluateAnd(arrCopy);
}
const evaluateOr = (array: EvaluatedValue[]): boolean[] => {
  const arrCopy = [...array];
  const index = arrCopy.findIndex(expr => expr === '||');
  if (index === -1) return (array as boolean[]);
  
  arrCopy[index-1] = (array[index-1] || array[index+1]) as EvaluatedValue;
  arrCopy.splice(index,2);
  return evaluateOr(arrCopy);
}

const conditionalOperators = ['!', '&&', '||'];
const conditionalOperatorSearchPattern = /(!|&&|\|\|)/gm;

/**
 * Evaluates an expression of the form "questionId1 && questionId2 || !questionId3".
 * Allowed boolean operators are !, &&, ||. Parenthesis are not supported.
 * Evaluates ! first, then && and lastly ||.
 */
export const evaluateConditionalExpression = (
  condition: string,  
  answers: Record<string, any>,
  questions?: Question[]): boolean => {
    if (!Array.isArray(questions)) return false;

    const conditionAsArray = condition.split(conditionalOperatorSearchPattern).map(string => string.trim()).filter(string => string !== '');

    const evaluatedAnswers: EvaluatedValue[] = conditionAsArray.map(valueOrOperator => {
      if (!conditionalOperators.includes(valueOrOperator))
        return evaluateAnswer(valueOrOperator, answers, questions);
      else 
        return (valueOrOperator as '!' | '&&' | '||');
    });
    const [evaluated] = evaluateOr(evaluateAnd(evaluateNot(evaluatedAnswers)));
    return evaluated;
  };
