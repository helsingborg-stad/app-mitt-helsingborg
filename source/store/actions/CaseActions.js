import generateInitialCase from 'app/store/actions/dynamicFormData';
import { get, post, put } from 'app/helpers/ApiRequest';

export const actionTypes = {
  updateCase: 'UPDATE_CASE',
  createCase: 'CREATE_CASE',
  deleteCase: 'DELETE_CASE',
  fetchCases: 'FETCH_CASE',
  apiError: 'API_ERROR',
};

const createAnswerObject = data => ({
  fieldId: data?.fieldId ?? null,
  value: data?.value ?? null,
  parentId: data?.parentId ?? null,
  tags: data?.tags ?? [],
});

const ConvertAnswersToArray = (data, form) => {
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

export async function updateCase(caseId, data, status, currentStep, form, callback) {
  const answers = ConvertAnswersToArray(data, form);
  const body = {
    status,
    answers,
    currentStep,
  };

  try {
    const res = await put(`/cases/${caseId}`, JSON.stringify(body));
    const { id, attributes } = res.data.data;
    const flatUpdatedCase = { id, updatedAt: Date.now(), ...attributes };
    if (callback) callback(flatUpdatedCase);
    return {
      type: actionTypes.updateCase,
      payload: flatUpdatedCase,
    };
  } catch (error) {
    console.log(`Update current case error: ${error}`);
    return {
      type: actionTypes.apiError,
      payload: error,
    };
  }
}

export async function createCase(formId, user, cases, callback) {
  let initialData = generateInitialCase(formId, user, cases);
  initialData = []; // TODO: fix initial data strucutre

  const body = {
    formId,
    userId: parseInt(user.personalNumber),
    provider: 'VIVA', // TODO: Fix hardcoded value
    status: 'ongoing',
    currentStep: 0,
    details: {
      personalNumber: parseInt(user.personalNumber),
      period: {
        startDate: 1601994748326, // TODO: Fix hardcoded value
        endDate: 1701994748326, // TODO: Fix hardcoded value
      },
    },
    answers: initialData || [],
  };

  try {
    const response = await post('/cases', JSON.stringify(body));
    console.log('create case response', response);
    const newCase = response.data.data;
    const flattenedNewCase = { id: newCase.id, ...newCase.attributes };
    callback(flattenedNewCase);
    return {
      type: actionTypes.createCase,
      payload: flattenedNewCase,
    };
  } catch (error) {
    console.log('create case api error', error);
    return {
      type: actionTypes.apiError,
      payload: error,
    };
  }
}

export function deleteCase(caseId) {
  return {
    type: actionTypes.deleteCase,
    payload: caseId,
  };
}

export async function fetchCases(callback) {
  try {
    const response = await get('/cases');
    if (response?.data?.data?.map) {
      const cases = {};
      response.data.data.forEach(c => (cases[c.id] = { id: c.id, ...c.attributes }));

      callback(cases);
      return {
        type: actionTypes.fetchCases,
        payload: cases,
      };
    }
  } catch (error) {
    console.error(error);
    return {
      type: actionTypes.apiError,
      payload: error,
    };
  }
  return {
    type: actionTypes.fetchCases,
    payload: {},
  };
}
