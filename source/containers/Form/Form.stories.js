import React from 'react';
import { storiesOf } from '@storybook/react-native';
import StoryWrapper from '../../components/molecules/StoryWrapper';
import Form from './Form';

const formStories = storiesOf('Form', module);

const DefaultStoryData = {
  connectivityMatrix: [
    ['none', 'next', 'none'],
    ['back', 'none', 'next'],
    ['none', 'back', 'none'],
  ],
  title: 'Validation test form',
  description: 'Test formulär för validering av fält',
  formType: 'EKB-recurring',
  name: 'Test av valideringsregler',
  provider: 'VIVA',
  steps: [
    {
      id: 1,
      name: 'Start steg',
      title: 'Test av validering för fält',
      group: 'test',
      description: 'Detta formulär är ett test för att se så att validering av olika fält fungerar',
      banner: {},
      actions: [
        {
          label: 'Nästa steg',
          type: 'next',
        },
      ],
    },
    {
      id: 2,
      name: 'Validering av steg',
      title: 'Test av validering för fält',
      group: 'test',
      description:
        'Detta är ett formulär är ett test för att se så att validering av olika fält fungerar',
      actions: [
        {
          label: 'Nästa steg',
          type: 'next',
        },
      ],
      banner: {},
      questions: [
        {
          id: 1,
          description: 'Beskrivning av ett nummer fält',
          label: 'Ett nummer fält',
          placeholder: 'Skriv ett nummer',
          type: 'number',
          validation: {
            isRequired: true,
            rules: [
              {
                method: 'isEmpty',
                validWhen: false,
              },
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
            ],
          },
        },
        {
          id: 2,
          description: 'Beskrivning av ett postnummer fält',
          label: 'Ett fält för postnummer',
          placeholder: 'Ange ditt postnummer',
          type: 'number',
          validation: {
            isRequired: true,
            rules: [
              {
                method: 'isEmpty',
                validWhen: false,
              },
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
                message: 'Postnummret du angav är inte giltligt',
              },
            ],
          },
        },
        {
          id: 3,
          description: 'Beskrivning för ett mobilnummer fält',
          label: 'Ett mobilnummer fält',
          type: 'number',
          placeholder: '+46',
          validation: {
            isRequired: true,
            rules: [
              {
                method: 'isEmpty',
                validWhen: false,
                message: 'Du får inte lämna detta fält tomt',
              },
              {
                method: 'isMobilePhone',
                args: {
                  locale: 'sv-SE',
                },
                validWhen: true,
              },
            ],
          },
        },
        {
          id: 4,
          description: 'Beskrivning för ett text fält',
          label: 'Ett text fält',
          placeholder: 'Skriv något',
          type: 'text',
        },
        {
          id: 5,
          description: 'Beskrivning för ett URL fält',
          label: 'Ett URL fält',
          placeholder: 'https://cool.kid.com',
          type: 'text',
          validation: {
            isRequired: true,
            rules: [
              {
                method: 'isEmpty',
                validWhen: false,
                message: 'Du får inte lämna detta fält tomt',
              },
              {
                method: 'isURL',
                args: {
                  protocols: ['https'],
                },
                validWhen: true,
                message: 'Din url är inte säker använd https framför',
              },
            ],
          },
        },
        {
          id: 6,
          description: 'Beskrivning för ett email fält',
          placeholder: 'example@email.com',
          label: 'Ett email fält',
          type: 'text',
          validation: {
            isRequired: true,
            rules: [
              {
                method: 'isEmpty',
                validWhen: false,
                message: 'Du får inte lämna detta fält tomt',
              },
              {
                method: 'isEmail',
                validWhen: true,
                message: 'Du måste ange en giltlig email adress',
              },
            ],
          },
        },
        {
          id: 7,
          description: 'Beskrivning av ett checkbox fält',
          label: 'Ett checkbox fält',
          text: 'Du kan välja mig',
          type: 'checkbox',
          validation: {
            isRequired: true,
            rules: [
              {
                method: 'isEmpty',
                validWhen: true,
              },
            ],
          },
        },
      ],
    },
    {
      id: 3,
      name: 'Sista steget',
      title: 'Slut på testet',
      group: 'test',
      description: 'Tack för att du tog dig tiden att testa, vi uppskattar det',
      actions: [],
      banner: {},
    },
  ],
};

formStories.add('Default', () => (
  <StoryWrapper>
    <Form
      steps={DefaultStoryData.steps}
      firstName="FakeName"
      connectivityMatrix={DefaultStoryData.connectivityMatrix}
      startAt={0}
      onClose={() => {}}
      status="ongoing"
    />
  </StoryWrapper>
));

const ThemedFormStoryData = {
  connectivityMatrix: [
    ['none', 'next', 'none'],
    ['back', 'none', 'next'],
    ['none', 'back', 'none'],
  ],
  title: 'Validation test form',
  description: 'Test formulär för validering av fält',
  formType: 'EKB-recurring',
  name: 'Test av valideringsregler',
  provider: 'VIVA',
  steps: [
    {
      id: 1,
      name: 'step one',
      title: 'Vill du ansöka om ekonomiskt bistånd  för perioden #datum! - #datum2?',
      group: 'Ekonomiskt Bistånd',
      description: '',
      banner: {},
      actions: [
        {
          label: 'Nästa steg',
          type: 'next',
        },
      ],
    },
    {
      id: 2,
      name: 'step two',
      title: 'Hej Tomas! Stämmer de här uppgifterna om dig?',
      group: 'Ekonmiskt Bistånd',
      description: '',
      actions: [
        {
          label: 'Nästa steg',
          type: 'next',
        },
      ],
      banner: {},
      questions: [
        {
          id: 1,
          description: 'Beskrivning av ett nummer fält',
          label: 'Ett nummer fält',
          placeholder: 'Skriv ett nummer',
          type: 'number',
          validation: {
            isRequired: true,
            rules: [
              {
                method: 'isEmpty',
                validWhen: false,
              },
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
            ],
          },
        },
      ],
    },
    {
      id: 3,
      name: 'step three',
      title: 'Tack för din ansökan!',
      group: 'Ekonomiskt Bistånd',
      description: 'Din ansökan är nu inskickad och du kommer få besked inom 10 dagar.',
      actions: [],
      banner: {},
    },
  ],
};
formStories.add('Themed Form', () => (
  <StoryWrapper>
    <Form
      steps={ThemedFormStoryData.steps}
      connectivityMatrix={ThemedFormStoryData.connectivityMatrix}
      firstName="FakeName"
      status="ongoing"
      startAt={0}
      onClose={() => {}}
    />
  </StoryWrapper>
));

const SubstepsDemoStoryData = {
  updatedAt: 1605794610210,
  connectivityMatrix: [
    ['none', 'next', 'none', 'down', 'none', 'down', 'none'],
    ['back', 'none', 'next', 'none', 'none', 'none', 'none'],
    ['none', 'back', 'none', 'none', 'none', 'none', 'none'],
    ['up', 'none', 'none', 'none', 'next', 'none', 'none'],
    ['up', 'none', 'none', 'back', 'none', 'none', 'none'],
    ['up', 'none', 'none', 'none', 'none', 'none', 'down'],
    ['none', 'none', 'none', 'none', 'none', 'up', 'none'],
  ],
  createdAt: 1605794610210,
  steps: [
    {
      questions: [
        {
          description: '',
          label: '',
          id: 'navGroup1',
          buttons: [
            {
              navigationType: {
                type: 'navigateDown',
                stepId: '13a860d7-3971-40fa-9ee7-33680f4393a0',
              },
              color: 'red',
              text: 'Sub 1',
            },
            {
              navigationType: {
                type: 'navigateDown',
                stepId: '9958e6df-00eb-4226-b1ce-3dfbe6cee4b3',
              },
              text: 'Other sub',
            },
          ],
          type: 'navigationButtonGroup',
          inputSelectValue: 'navigationButtonGroup',
        },
      ],
      description: '',
      banner: {
        iconSrc: '',
        imageSrc: '',
        backgroundColor: '',
      },
      id: 'f3ea3110-2fb9-47f5-827e-b94888565224',
      title: 'Main 1',
      actions: [
        {
          type: 'next',
          color: 'blue',
          label: 'Next',
        },
      ],
      group: '',
    },
    {
      description: '',
      banner: {
        iconSrc: '',
        imageSrc: '',
        backgroundColor: '',
      },
      id: '02b3e565-92ce-44b9-8d6a-e41e7d18a5bc',
      title: 'Main 2',
      actions: [
        {
          type: 'next',
          color: 'green',
          label: 'Next',
        },
      ],
      group: '',
    },
    {
      description: '',
      banner: {
        iconSrc: '',
        imageSrc: '',
        backgroundColor: '',
      },
      id: '6651824f-58da-410a-bd0f-02343da14d7f',
      title: 'Main 3',
      actions: [
        {
          type: 'close',
          color: 'red',
          label: 'Close',
        },
      ],
      group: '',
    },
    {
      description: '',
      banner: {
        iconSrc: '',
        imageSrc: '',
        backgroundColor: '',
      },
      id: '13a860d7-3971-40fa-9ee7-33680f4393a0',
      title: 'Sub 1 1',
      actions: [
        {
          type: 'next',
          label: 'Next',
        },
      ],
      group: '',
    },
    {
      description: '',
      banner: {
        iconSrc: '',
        imageSrc: '',
        backgroundColor: '',
      },
      id: '30741077-4a26-4a49-b81f-85f55bc2d3fc',
      title: 'Sub 1 2',
      actions: [
        {
          type: 'next',
          label: 'Next (back to top)',
        },
      ],
      group: '',
    },
    {
      questions: [
        {
          description: '',
          label: '',
          id: 'navGroup2',
          buttons: [
            {
              navigationType: {
                type: 'navigateDown',
                stepId: '1f65b332-c3ca-4f1c-b67b-5e5449d56dbe',
              },
              text: 'Go down',
            },
          ],
          type: 'navigationButtonGroup',
          inputSelectValue: 'navigationButtonGroup',
        },
      ],
      description: '',
      banner: {
        iconSrc: '',
        imageSrc: '',
        backgroundColor: '',
      },
      id: '9958e6df-00eb-4226-b1ce-3dfbe6cee4b3',
      title: 'Other sub',
      actions: [
        {
          type: 'next',
          color: 'green',
          label: 'Go back',
        },
      ],
      group: '',
    },
    {
      description: '',
      banner: {
        iconSrc: '',
        imageSrc: '',
        backgroundColor: '',
      },
      id: '1f65b332-c3ca-4f1c-b67b-5e5449d56dbe',
      title: 'Sub sub',
      actions: [
        {
          type: 'next',
          color: 'blue',
          label: 'Go up',
        },
      ],
      group: '',
    },
  ],
  provider: 'TEST',
  subform: false,
  PK: 'FORM#00be0910-2a70-11eb-a9af-ddffd6ddc5a0',
  description: 'small form for testing purposes',
  id: '00be0910-2a70-11eb-a9af-ddffd6ddc5a0',
  name: 'Grupperingstester',
};

formStories.add('Substep Form', () => (
  <StoryWrapper>
    <Form
      steps={SubstepsDemoStoryData.steps}
      connectivityMatrix={SubstepsDemoStoryData.connectivityMatrix}
      firstName="FakeName"
      status="ongoing"
      onClose={() => {}}
      startAt={0}
    />
  </StoryWrapper>
));
