const createAnswerObject = data => ({
  fieldId: data?.fieldId ?? null,
  value: data?.value ?? null,
  parentId: data?.parentId ?? null,
  tags: data?.tags ?? [],
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
 * TODO: Add implementation of auto generated IDs and Tags in form builder
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

    switch (type) {
      case 'editableList':
        Object.entries(value).forEach(valueObject => {
          const [childFieldId, childValue] = valueObject;
          const listItem = other.inputs.find(obj => obj.key === childFieldId);
          const { tags: listItemTags } = listItem;

          answers.push(
            createAnswerObject({
              fieldId: childFieldId,
              value: childValue,
              parentId: id,
              tags: listItemTags ?? [],
            })
          );
        });
        return;

      case 'avatarList':
        Object.entries(value).forEach(valueObject => {
          const [childFieldId, childValue] = valueObject;
          answers.push(
            createAnswerObject({
              fieldId: `${id}-${childFieldId}`,
              value: childValue,
              parentId: id,
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
                fieldId: `${id}-${childFieldId}-${repeaterItemId}`,
                value: repeaterItemValue,
                parentId: id,
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
