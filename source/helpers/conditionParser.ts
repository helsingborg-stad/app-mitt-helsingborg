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

  if (question.type === 'checkbox') {
    if (answers[questionId]) return answers[questionId];
      return false;
  } 
  else if (['text','number','date'].includes(question.type))
    return (answers[questionId] && answers[questionId] !== '');
  else if (question.type === 'editableList')
    return (
      answers[questionId] &&
      Object.keys(answers[questionId]).filter(
        (key) => answers[questionId][key] && answers[questionId][key] !== ''
      ).length > 0
    );
  else if (question.type === 'summaryList') 
    return evaluateSummaryList(answers, question.items || []);

  return false;
};

type Operator = '!' | '&&' | '||';
type EvaluatedValue = boolean | Operator;

// evaluation functions
const evaluateOperatorInArray = (conditionAsArray: EvaluatedValue[], operator: Operator, index: number ) => {
  if (operator === '!') {
    conditionAsArray[index+1] = !conditionAsArray[index+1];
      conditionAsArray.splice(index,1);
  } else {
      if (operator === '&&') conditionAsArray[index-1] = (conditionAsArray[index-1] && conditionAsArray[index+1]) as EvaluatedValue;
      if (operator === '||') conditionAsArray[index-1] = (conditionAsArray[index-1] || conditionAsArray[index+1]) as EvaluatedValue;
      conditionAsArray.splice(index,2);
  }
};
const evaluateNot = (conditionAsArray: EvaluatedValue[]): EvaluatedValue[] => {
  const arrayCopy = [...conditionAsArray];
  const reversedIndex = arrayCopy.reverse().findIndex(expr => expr === '!');
  if (reversedIndex === -1) return conditionAsArray;
  
  const index = arrayCopy.length - reversedIndex - 1;
  evaluateOperatorInArray(arrayCopy.reverse(), '!', index);
  return evaluateNot(arrayCopy);
};
const evaluateAnd = (conditionAsArray: EvaluatedValue[]): EvaluatedValue[] => {
  const arrayCopy = [...conditionAsArray];
  const index = arrayCopy.findIndex(expr => expr === '&&');
  if (index === -1) return conditionAsArray;
  
  evaluateOperatorInArray(arrayCopy, '&&', index);
  return evaluateAnd(arrayCopy);
}
const evaluateOr = (conditionAsArray: EvaluatedValue[]): boolean[] => {
  const arrayCopy = [...conditionAsArray];
  const index = arrayCopy.findIndex(expr => expr === '||');
  if (index === -1) return (conditionAsArray as boolean[]);
  
  evaluateOperatorInArray(arrayCopy, '||', index);
  return evaluateOr(arrayCopy);
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
