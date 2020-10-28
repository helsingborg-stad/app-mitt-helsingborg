const createAnswerObject = data => ({
  fieldId: data?.fieldId ?? null,
  value: data?.value ?? null,
  parentId: data?.parentId ?? null,
  tags: data?.tags ?? [],
});

export const convertAnswersToArray = (data, form) => {
  const answers = [];

  if (!data || typeof data !== 'object' || !form.steps) {
    return answers;
  }

  const formQuestions = [];
  form.steps.forEach(step => {
    if (step.questions) {
      step.questions.forEach(question => {
        formQuestions.push(question);
      });
    }
  });

  Object.entries(data).forEach(answer => {
    const [fieldId, value] = answer;
    const { id, type, tags } = formQuestions.find(element => element.id === fieldId);

    switch (type) {
      case 'editableList':
        Object.entries(value).forEach(valueObject => {
          const [childFieldId, childValue] = valueObject;
          answers.push(
            createAnswerObject({
              fieldId: childFieldId, // TODO: Add implementation of auto generated IDs in form builder
              value: childValue,
              parentId: id,
              tags, // TODO: Add implementation of Tags in form builder
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

            answers.push(
              createAnswerObject({
                fieldId: `${id}-${childFieldId}-${repeaterItemId}`,
                value: repeaterItemValue,
                parentId: id,
                tags,
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
