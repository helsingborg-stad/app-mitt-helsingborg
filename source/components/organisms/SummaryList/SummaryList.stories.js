import React, { useState } from 'react';
import { ScrollView } from 'react-native';
import { storiesOf } from '@storybook/react-native';
import StoryWrapper from '../../molecules/StoryWrapper';
import SummaryList from './SummaryList';
import { Input, Label, Text } from '../../atoms';
import CheckboxField from '../../molecules/CheckboxField/CheckboxField';
import Form from '../../../containers/Form/Form';

const stories = storiesOf('Summary List', module);

const status = {
  type: 'active:ongoing',
  name: 'Pågående',
  description: 'Du har påbörjat en ansökan. Du kan öppna din ansökan och fortsätta där du slutade.',
};

const items = [
  { id: 'f1', type: 'text', title: 'favoritfrukt', category: 'fruit' },
  { id: 'f2', type: 'text', title: 'grönsak', category: 'vegetable' },
  { id: 'pris1', type: 'number', title: 'pris1', category: 'fruit' },
  { id: 'pris2', type: 'number', title: 'pris2', category: 'vegetable' },
  { id: 'box1', type: 'checkbox', title: 'Checkbox', category: 'vegetable' },
];

const categories = [
  { category: 'fruit', description: 'Frukt' },
  { category: 'vegetable', description: 'Grönsak' },
];

const SummaryStory = () => {
  const [state, setState] = useState({});
  return (
    <ScrollView>
      <Text>Fyll i några fält för att visa sammanfattningen</Text>
      <Label>
        <Text>Favoritfrukt</Text>
      </Label>
      <Input
        value={state.f1}
        onChangeText={(text) => {
          setState((oldState) => {
            oldState.f1 = text;
            return { ...oldState };
          });
        }}
      />
      <Label>
        <Text>Fruktens pris</Text>
      </Label>
      <Input
        value={state.pris1}
        onChangeText={(text) => {
          setState((oldState) => {
            oldState.pris1 = text;
            return { ...oldState };
          });
        }}
      />
      <Label>
        <Text>Favoritgrönsak</Text>
      </Label>
      <Input
        value={state.f2}
        onChangeText={(text) => {
          setState((oldState) => {
            oldState.f2 = text;
            return { ...oldState };
          });
        }}
      />
      <Label>
        <Text>Grönsakens pris</Text>
      </Label>
      <Input
        value={state.pris2}
        onChangeText={(text) => {
          setState((oldState) => {
            oldState.pris2 = text;
            return { ...oldState };
          });
        }}
      />
      <CheckboxField
        text="Do you feel it?"
        color="blue"
        size="small"
        value={state.box1}
        onChange={() => {
          setState((oldState) => {
            oldState.box1 = !oldState.box1;
            return { ...oldState };
          });
        }}
        help={{ text: 'some other helper text' }}
      />
      <SummaryList
        heading="Sammanfattning"
        items={items}
        categories={categories}
        color="green"
        onChange={(answer, id) => {
          setState((oldState) => {
            oldState[id] = answer;
            return { ...oldState };
          });
        }}
        answers={state}
        showSum
      />
      <SummaryList
        heading="Blå, ingen summa, med hjälp"
        help={{ text: 'hello from the help text', heading: 'Do not fear, help is here' }}
        items={items}
        categories={categories}
        color="blue"
        onChange={(answer, id) => {
          setState((oldState) => {
            oldState[id] = answer;
            return { ...oldState };
          });
        }}
        answers={state}
        showSum={false}
        startEditable
      />
    </ScrollView>
  );
};

stories.add('default', () => (
  <StoryWrapper>
    <SummaryStory />
  </StoryWrapper>
));

const validationTestForm = {
  updatedAt: 1603718388688,
  connectivityMatrix: [['none']],
  createdAt: 1603718388688,
  steps: [
    {
      questions: [
        {
          labelHelp: 'text',
          loadPrevious: ['text_1'],
          inputSelectValue: 'email',
          description: 'email',
          label: 'Email',
          id: 'text_1',
          type: 'text',
          validation: {
            isRequired: true,
            rules: [
              {
                method: 'isEmail',
                message: 'Epostadressen ser inte ut att vara korrekt',
                validWhen: true,
              },
              {
                method: 'isEmpty',
                message: 'Du får inte lämna detta fält tomt',
                validWhen: false,
              },
            ],
          },
          tags: ['tagsHere', 'moreTags'],
        },
        {
          loadPrevious: ['number_1'],
          inputSelectValue: 'phone',
          description: 'Number222',
          label: 'Phone number',
          id: 'number_1',
          type: 'number',
          validation: {
            isRequired: true,
            rules: [
              {
                args: {
                  locale: 'sv-SE',
                },
                validWhen: true,
                method: 'isMobilePhone',
                message: 'Numret du angav är inte ett giltigt telefonnummer',
              },
              {
                method: 'isEmpty',
                message: 'Du får inte lämna detta fält tomt',
                validWhen: false,
              },
            ],
          },
        },
        {
          description: 'date',
          label: 'Date',
          id: 'date_1',
          type: 'date',
          labelHelp: 'date',
        },
        {
          heading: 'Summary list',
          inputSelectValue: 'summaryList',
          showSum: true,
          description: 'Summary list',
          label: 'Summary list',
          id: 'summary_list_1',
          categories: [
            {
              category: 'cat_1',
              description: 'User info',
            },
          ],
          type: 'summaryList',
          items: [
            {
              id: 'text_1',
              title: 'email',
              category: 'cat_1',
              type: 'text',
              inputSelectValue: 'text',
              validation: {
                isRequired: false,
                rules: [],
              },
            },
            {
              id: 'number_1',
              title: 'phone',
              category: 'cat_1',
              type: 'number',
              inputSelectValue: 'number',
              validation: {
                isRequired: false,
                rules: [
                  {
                    args: {
                      options: {
                        no_symbols: true,
                      },
                    },
                    validWhen: true,
                    method: 'isNumeric',
                    message: 'Du måste ange en siffra',
                  },
                ],
              },
            },
            {
              inputId: 'amount',
              inputSelectValue: 'arrayNumber',
              id: 'repeater_1',
              title: 'Repeater',
              category: 'cat_1',
              type: 'arrayNumber',
              validation: {
                isRequired: false,
                rules: [
                  {
                    args: {
                      options: {
                        no_symbols: true,
                      },
                    },
                    validWhen: true,
                    method: 'isNumeric',
                    message: 'Du måste ange en siffra',
                  },
                ],
              },
            },
            {
              inputId: 'date',
              id: 'repeater_1',
              title: 'Repeater date',
              type: 'arrayDate',
              category: 'cat_1',
              inputSelectValue: 'arrayDate',
            },
          ],
        },
        {
          addButtonText: 'Add',
          heading: 'Repeater',
          inputs: [
            {
              id: 'text',
              type: 'text',
              title: 'Text',
              inputSelectValue: 'text',
              validation: {
                isRequired: false,
                rules: [],
              },
              tags: ['repeaterTag', 'moreTags'],
            },
            {
              id: 'amount',
              title: 'Amount',
              type: 'number',
              inputSelectValue: 'number',
              validation: {
                isRequired: false,
                rules: [
                  {
                    args: {
                      options: {
                        no_symbols: true,
                      },
                    },
                    validWhen: true,
                    method: 'isNumeric',
                    message: 'Du måste ange en siffra',
                  },
                ],
              },
              tags: ['amount'],
            },
            {
              id: 'pnum',
              type: 'number',
              title: 'personnummer',
              inputSelectValue: 'personalNumber',
              validation: {
                isRequired: true,
                rules: [
                  {
                    method: 'isNumeric',
                    message: 'Enbart siffror i ett personnummer',
                    validWhen: true,
                  },
                  {
                    args: {
                      options: {
                        max: 12,
                        min: 12,
                      },
                    },
                    validWhen: true,
                    method: 'isLength',
                    message: 'Ange personnummer med 12 siffror',
                  },
                  {
                    method: 'isEmpty',
                    message: 'Du får inte lämna detta fält tomt',
                    validWhen: false,
                  },
                ],
              },
              tags: ['repeaterTags', 'pnum'],
            },
            {
              id: 'date',
              title: 'Date',
              type: 'date',
              inputSelectValue: 'date',
            },
          ],
          description: 'repeater',
          label: 'Repeater',
          id: 'repeater_1',
          type: 'repeaterField',
        },
        {
          labelHelp: 'Check me!',
          loadPrevious: ['checkbox_1'],
          inputSelectValue: 'checkbox_1',
          description: 'checkbox',
          label: 'Check box',
          text: 'Check me!',
          id: 'checkbox_1',
          type: 'checkbox',
          validation: {
            isRequired: true,
            rules: [
              {
                arg: 'true',
                method: 'equals',
                message: 'Måste checkas i för att gå vidare',
                validWhen: true,
              },
            ],
          },
        },
      ],
      description: 'step 1',
      banner: {
        iconSrc: '',
        imageSrc: '',
        backgroundColor: '',
      },
      id: '597e353e-d790-4e9d-8b1e-436bf43b834f',
      title: 'Step 1',
      actions: [
        {
          type: 'next',
          label: 'Submit',
        },
      ],
      group: 'step 1',
    },
  ],
  provider: 'VIVA',
  subform: false,
  PK: 'FORM#ec47ad00-178d-11eb-b1b1-f33b2604caa4',
  description: 'Test form',
  id: 'ec47ad00-178d-11eb-b1b1-f33b2604caa4',
  name: 'Test form',
  formType: 'EKB-recurring',
};

const SummaryValidationStory = () => (
  <Form
    steps={validationTestForm.steps}
    connectivityMatrix={validationTestForm.connectivityMatrix}
    startAt={0}
    firstName="FakeName"
    status={status}
  />
);

stories.add('Validation', () => (
  <StoryWrapper>
    <SummaryValidationStory />
  </StoryWrapper>
));
