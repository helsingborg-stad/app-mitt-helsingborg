import generateInitialCase from 'app/store/actions/dynamicFormData';
import mockUser from 'source/assets/mock/user';

const mockCases = {
  c1: {
    id: 'c1',
    formId: 'form1',
    updatedAt: 100,
    data: {
      name: 'Samwise Gamgee',
      hobbies: ['cooking', 'pipe smoking'],
    },
  },
  c2: {
    id: 'c2',
    formId: 'form1',
    updatedAt: 200,
    data: {
      name: 'Frodo Baggins',
      hobbies: ['travelling', 'stories'],
      personalInfo: {
        email: 'frodo.baggins@fellowship.com',
      },
    },
  },
  c3: {
    id: 'c3',
    formId: 'form2',
    updatedAt: 300,
    data: {
      name: 'Aragorn',
      hobbies: [],
      personalInfo: {
        email: 'aragorn@gondor.com',
      },
    },
  },
};

const mockFormDataMap = {
  form1: {
    personalInfo: {
      email: 'form1.personalInfo.email||user.email',
    },
    name: 'form1.name',
    telephone: 'form1.notHere||user.telephone',
    eyeColor: 'form1.notHere||user.notHereEither',
    hobbies: 'form1.hobbies',
    civilStatus: 'user.civilStatus',
  },
};

test(`It should correctly generate the initial case from the user and previous cases`, async () => {
  const initialCaseData = generateInitialCase('form1', mockUser.user, mockCases, mockFormDataMap);

  // It should find that the c2 form is the latest one with correct form id,
  // and get the values that exists on it from there.
  // The telephone prop exists on user but not on the case, so we should fetch it from there.
  // eye color does not exist on any of them, so we should get an empty string.
  expect(initialCaseData).toEqual({
    personalInfo: {
      email: 'frodo.baggins@fellowship.com',
    },
    name: 'Frodo Baggins',
    telephone: '760000009',
    eyeColor: '',
    hobbies: ['travelling', 'stories'],
    civilStatus: 'OG',
  });
});
