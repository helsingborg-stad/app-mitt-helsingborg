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
                args: [
                  {
                    options: {
                      no_symbols: true,
                    },
                  },
                ],
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
                args: [
                  {
                    options: {
                      no_symbols: true,
                    },
                  },
                ],
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
                method: 'isMobilePohne',
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
          validation: {
            isRequired: true,
            rules: [
              {
                method: 'isEmpty',
                validWhen: false,
                message: 'Du får inte lämna detta fält tomt',
              },
              {
                method: 'isAlphanumeric',
                args: {
                  locale: 'sv-SE',
                },
                validWhen: true,
                message: 'Du får endast använda bokstäver och siffror',
              },
            ],
          },
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
            isRequeried: true,
            rules: [
              {
                method: 'isEmpty',
                validWhen: false,
              },
              {
                method: 'isEmail',
                validWhen: true,
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
      status="ongoing"
    />
  </StoryWrapper>
));
