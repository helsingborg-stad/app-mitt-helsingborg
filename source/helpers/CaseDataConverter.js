/**
 * Cretaes an answer object with required fields
 * @param {Object} data
 */
const createAnswerObject = data => ({
  field: {
    id: data?.fieldId ?? null,
    tags: data?.tags ?? [],
  },
  value: data?.value ?? null,
});

/**
 * Returns form questions as a flat array
 * @param {obj} form
 */
export const getFormQuestions = form => {
  const formQuestions = [];
  if (!form || typeof form !== 'object') {
    return formQuestions;
  }

  form.steps.forEach(step => {
    if (step.questions) {
      step.questions.forEach(question => {
        formQuestions.push(question);
      });
    }
  });

  return formQuestions;
};

/**
 * Convert answers in context to an array that follows Case API data structure
 * @param {obj} data
 * @param {obj} formQuestions
 */
export const convertAnswersToArray = (data, formQuestions) => {
  const answers = [];

  if (!data || typeof data !== 'object' || !formQuestions || typeof formQuestions !== 'object') {
    return answers;
  }

  Object.entries(data).forEach(answer => {
    const [fieldId, value] = answer;
    const { id, type, tags, ...other } = formQuestions.find(element => element.id === fieldId);

    if (value === undefined) {
      return;
    }

    switch (type) {
      case 'editableList':
        Object.entries(value).forEach(valueObject => {
          const [childFieldId, childValue] = valueObject;
          const listItem = other.inputs.find(obj => obj.key === childFieldId);
          const { tags: listItemTags } = listItem;

          answers.push(
            createAnswerObject({
              fieldId: `${id}.${childFieldId}`,
              value: childValue,
              tags: listItemTags ?? [],
            })
          );
        });
        return;

      // TODO: AvatarList component is broken so this needs to be updated when it works
      case 'avatarList':
        Object.entries(value).forEach(valueObject => {
          const [childFieldId, childValue] = valueObject;
          answers.push(
            createAnswerObject({
              fieldId: `${id}.${childFieldId}`,
              value: childValue,
              tags,
            })
          );
        });
        return;

      case 'repeaterField':
        Object.entries(value).forEach(repeaterField => {
          const [childFieldId, childItems] = repeaterField;

          Object.entries(childItems).forEach(childItem => {
            const [repeaterItemId, repeaterItemValue] = childItem;
            const repeaterFieldItem = other.inputs.find(obj => obj.id === repeaterItemId);
            const { tags: repeaterFieldItemTags } = repeaterFieldItem;

            answers.push(
              createAnswerObject({
                fieldId: `${id}.${childFieldId}.${repeaterItemId}`,
                value: repeaterItemValue,
                tags: repeaterFieldItemTags ?? [],
              })
            );
          });
        });

        return;

      default:
        answers.push(
          createAnswerObject({
            fieldId: id,
            value,
            tags,
          })
        );
    }
  });

  return answers;
};

/**
 * Checks if string is a numeric value
 * @param {string} str
 */
const isNumeric = str => {
  if (typeof str !== 'string') return false; // we only process strings!
  // eslint-disable-next-line no-restricted-globals
  return !isNaN(str) && !isNaN(parseFloat(str));
};

/**
 * Converts case answers array to object
 * Credits to Jacob for the magical data mapping
 * @param {array} answerArray the flat array that we want to convert to a nested tree structure
 */
export const convertAnswerArrayToObject = answerArray => {
  const caseObject = {};
  if (!Array.isArray(answerArray)) {
    return caseObject;
  }

  answerArray.forEach(answer => {
    const path = answer.field.id.split('.');
    path.reduce((prev, pathPart, i) => {
      if (!prev) {
        return undefined;
      }
      if (!prev[pathPart]) {
        if (i === path.length - 1) {
          prev[pathPart] = answer.value;
        } else if (isNumeric(path[i + 1])) {
          prev[pathPart] = [];
        } else {
          prev[pathPart] = {};
        }
      }

      return prev[pathPart];
    }, caseObject);
  });

  return caseObject;
};
