import React from 'react';
import { storiesOf } from '@storybook/react-native';
import StoryWrapper from '../StoryWrapper';
import Form from '../../../containers/Form/Form';

const repeaterFieldStories = storiesOf('RepeaterField', module);

const status = {
  type: 'active:ongoing',
  name: 'Pågående',
  description: 'Du har påbörjat en ansökan. Du kan öppna din ansökan och fortsätta där du slutade.',
};

const DefaultStoryForm = {
  connectivityMatrix: [['none']],
  title: 'Repeater validation test form',
  description: 'test of repeater validation',
  provider: 'TEST',

  steps: [
    {
      questions: [
        {
          addButtonText: 'Add',
          heading: 'Repeater',
          color: 'red',
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
              title: 'Personnummer',
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
              id: 'postalCode',
              type: 'number',
              title: 'Postkod',
              inputSelectValue: 'postalCode',
              validation: {
                isRequired: false,
                rules: [
                  {
                    method: 'isNumeric',
                    args: {
                      options: {
                        no_symbols: true,
                      },
                    },
                    validWhen: true,
                    message: 'Du har angett en siffra som är mindre än 1',
                  },
                  {
                    method: 'isPostalCode',
                    args: {
                      locale: 'SE',
                    },
                    validWhen: true,
                    message: 'Postnummret du angav är inte giltigt',
                  },
                ],
              },
              tags: ['repeaterTags', 'pnum'],
            },
          ],
          description: 'repeater',
          label: 'Repeater',
          id: 'repeater_1',
          type: 'repeaterField',
        },
        {
          addButtonText: 'Lägg till',
          heading: 'Something',
          color: 'darkBlue',
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
              title: 'Personnummer',
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
              id: 'postalCode',
              type: 'number',
              title: 'Postkod',
              inputSelectValue: 'postalCode',
              validation: {
                isRequired: false,
                rules: [
                  {
                    method: 'isNumeric',
                    args: {
                      options: {
                        no_symbols: true,
                      },
                    },
                    validWhen: true,
                    message: 'Du har angett en siffra som är mindre än 1',
                  },
                  {
                    method: 'isPostalCode',
                    args: {
                      locale: 'SE',
                    },
                    validWhen: true,
                    message: 'Postnummret du angav är inte giltigt',
                  },
                ],
              },
              tags: ['repeaterTags', 'pnum'],
            },
          ],
          description: 'repeater',
          label: 'BlueDark theme',
          id: 'repeater_2',
          type: 'repeaterField',
        },
      ],
      description:
        'Testing the validation of repeater field inputs. Try putting various values in the repeater below: all fields except the first has some validation.',
      banner: {
        iconSrc: '',
        imageSrc: '',
        backgroundColor: '',
      },
      id: '597e353e-d790-4e9d-8b1e-436bf43b834f',
      title: 'Repeater validation test',
      actions: [],
      group: 'Repeater Story',
    },
  ],
};

const RepeaterStory = () => (
  <Form
    steps={DefaultStoryForm.steps}
    connectivityMatrix={DefaultStoryForm.connectivityMatrix}
    startAt={0}
    firstName="FakeName"
    status={status}
  />
);

repeaterFieldStories.add('default', () => (
  <StoryWrapper>
    <RepeaterStory />
  </StoryWrapper>
));
