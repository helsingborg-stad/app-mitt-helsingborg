import { Alert } from 'react-native';
import { sanitizePin } from '../helpers/ValidationHelper';

const forms = [
  {
    id: 1,
    name: 'Borgerlig vigsel',
    trigger: 'Vill boka borgerlig vigsel',
    questions: [
      {
        id: 'partnerName',
        position: 1,
        name: 'Vi börjar med information om din partner. Vad heter personen du ska gifta dig med?',
        type: 'text',
        placeholder: 'För- och efternamn',
        last: false,
      },
      {
        id: 'partnerSocialNumber',
        position: 2,
        name: ({ answers }) => `Vilket personnummer har ${answers.partnerName.split(' ')[0]}?`,
        type: 'number',
        placeholder: 'Personnummer',
        maxLength: 12,
        last: false,
      },
      {
        id: 'partnerSameAddress',
        position: 3,
        name: ({ answers }) => `Bor ${answers.partnerName.split(' ')[0]} samma adress som du?`,
        type: 'radio',
        last: false,
        options: [
          {
            value: 'Ja',
            icon: 'check',
          },
          {
            value: 'Nej',
            icon: 'close',
          },
        ],
        logics: {
          logic_type: 'question',
          actions: [
            {
              id: 1,
              condition: {
                op: 'equal',
                vars: [
                  {
                    value: 'Nej',
                  },
                  {
                    value: 'Nej',
                  },
                ],
              },
              action_type: 'add',
              target_question: 'partnerAddress',
            },
            {
              id: 2,
              condition: {
                op: 'equal',
                vars: [
                  {
                    value: 'Nej',
                  },
                  {
                    value: 'Nej',
                  },
                ],
              },
              action_type: 'add',
              target_question: 'partnerPostal',
            },
            {
              id: 3,
              condition: {
                op: 'equal',
                vars: [
                  {
                    value: 'Nej',
                  },
                  {
                    value: 'Nej',
                  },
                ],
              },
              action_type: 'add',
              target_question: 'partnerCity',
            },
            {
              id: 3,
              condition: {
                op: 'equal',
                vars: [
                  {
                    value: 'Ja',
                  },
                  {
                    value: 'Ja',
                  },
                ],
              },
              action_type: 'add',
              target_question: 'weddingLocation',
            },
          ],
        },
      },
      {
        id: 'partnerAddress',
        position: 4,
        name: ({ answers }) => `Vilken adress har ${answers.partnerName.split(' ')[0]}?`,
        type: 'text',
        placeholder: 'Adress',
        last: false,
      },
      {
        id: 'partnerPostal',
        position: 5,
        name: false,
        type: 'number',
        placeholder: 'Postnummer',
        last: false,
      },
      {
        id: 'partnerCity',
        position: 6,
        name: false,
        type: 'text',
        placeholder: 'Ort',
        last: false,
      },
      {
        id: 'weddingLocation',
        position: 7,
        name: 'Var vill ni gifta er?',
        type: 'radio',
        last: false,
        options: [
          {
            value: 'Rådhuset i Helsingborg',
          },
          {
            value: 'Egen vald plats',
          },
        ],
        logics: {
          logic_type: 'question',
          actions: [
            {
              id: 4,
              condition: {
                op: 'equal',
                vars: [
                  {
                    value: 'Rådhuset i Helsingborg',
                  },
                  {
                    value: 'Rådhuset i Helsingborg',
                  },
                ],
              },
              action_type: 'add',
              target_question: 'weddingDate',
            },
            {
              id: 5,
              condition: {
                op: 'equal',
                vars: [
                  {
                    value: 'Egen vald plats',
                  },
                  {
                    value: 'Egen vald plats',
                  },
                ],
              },
              action_type: 'add',
              target_question: 'weddingLocationCustom',
            },
          ],
        },
      },
      {
        id: 'weddingLocationCustom',
        position: 8,
        name: 'Vilken plats vill ni gifta er på?',
        type: 'text',
        placeholder: 'Val av plats',
        last: false,
      },
      {
        id: 'weddingDate',
        position: 9,
        name: 'Vilket datum vill ni gifta er?',
        type: 'datetime',
        last: false,
        explainer: [
          {
            key: 0,
            heading: 'Tid',
            content:
              'Ni kan bli vigda i Rådhuset följande tider:\nVardagar klockan 16 och 16: 30. Under sommaren 15:30 och 16.\nLördagar klockan 14, 14: 30, 15 och 15.30.\nDag före röd dag klockan 11: 30.\n\nUnder storhelger är Rådhuset stängt, men ni kan välja att istället boka vigsel på annan plats. ',
          },
        ],
      },
      {
        id: 'hasWitness',
        position: 10,
        name: 'Ni behöver ha två vittnen under er vigsel. Har ni bestämt vilka vittnen ni vill ha?',
        type: 'radio',
        last: false,
        options: [
          {
            value: 'Ja',
            icon: 'check',
          },
          {
            value: 'Nej jag vill komplettera senare',
            icon: 'close',
          },
        ],
        explainer: [
          {
            key: 0,
            heading: 'Vittnen',
            content:
              'Två vittnen måste närvara vid den borgerliga vigseln och det är brudparet som ansvarar för att vittnen finns. Vi behöver namn på era vittnen innan vigsel, men det går bra att komplettera med det efter att bokning är gjord. Vittnena ska vara över 15 år.',
          },
        ],
        logics: {
          logic_type: 'question',
          actions: [
            {
              id: 4,
              condition: {
                op: 'equal',
                vars: [
                  {
                    value: 'Ja',
                  },
                  {
                    value: 'Ja',
                  },
                ],
              },
              action_type: 'add',
              target_question: 'firstWitness',
            },
            {
              id: 5,
              condition: {
                op: 'equal',
                vars: [
                  {
                    value: 'Nej jag vill komplettera senare',
                  },
                  {
                    value: 'Nej jag vill komplettera senare',
                  },
                ],
              },
              action_type: 'add',
              target_question: 'hasNoWitness',
            },
          ],
        },
      },
      {
        id: 'firstWitness',
        position: 11,
        name: ['Vad heter era vittnen?'],
        type: 'text',
        placeholder: 'Vittne 1: För- och efternamn',
        last: false,
      },
      {
        id: 'secondWitness',
        position: 12,
        name: false,
        type: 'text',
        placeholder: 'Vittne 2: För- och efternamn',
        last: false,
        logics: {
          logic_type: 'question',
          actions: [
            {
              id: 4,
              condition: {},
              action_type: 'add',
              target_question: 'guestsTotal',
            },
          ],
        },
      },
      {
        id: 'hasNoWitness',
        position: 13,
        name:
          'Okej, då kan du göra detta senare.\n\nFör att vi ska kunna trycka ert vigselbevis behöver vi era vittnens namn senast 3 dagar innan vigsel.\n\nVi påminner dig i tid så att du inte glömmer.',
        type: 'message',
        last: false,
      },
      {
        id: 'guestsTotal',
        position: 14,
        name: [
          'I Rådhusets vigselsal får det vara 20 personer samtidigt. Ni kan därför som mest ha 17 gäster till er vigsel, inklusive barn och era vittnen.',
          'Hur många gäster kommer till er vigsel?',
        ],
        type: 'number',
        placeholder: 'Ange antal gäster',
        last: false,
        explainer: [
          {
            key: 0,
            heading: 'Gäster',
            content:
              'I Rådhusets vigselsal får det max vara 20 personer samtidigt. Ni kan därför som mest ha 17 gäster till er vigsel, inklusive barn och era vittnen.',
          },
        ],
      },
      {
        id: 'hindersProvning',
        position: 15,
        name: [
          'Innan ni gifter er måste Skatteverket intyga att det inte finns några hinder för giftermål.\n\nHar ni intyg för hindersprövning?',
        ],
        type: 'radio',
        last: false,
        options: [
          {
            value: 'Ja',
            icon: 'check',
          },
          {
            value: 'Nej',
            icon: 'close',
          },
        ],
        explainer: [
          {
            key: 0,
            heading: 'Hindersprövning',
            content:
              'Innan ni gifter er måste Skatteverket göra en hindersprövning, för att se till att det inte finns några hinder för äktenskapet. Ni ansöker om hindersprövning genom att fylla i en blankett som ni skickar till Skatteverket. Du hittar blanketten, och mer information om hindersprövning, på Skatteverkets webbplats.',
          },
        ],
        logics: {
          logic_type: 'question',
          actions: [
            {
              id: 1234,
              condition: {
                op: 'equal',
                vars: [
                  {
                    value: 'Ja',
                  },
                  {
                    value: 'Ja',
                  },
                ],
              },
              action_type: 'add',
              target_question: 'hindersProvningYes',
            },
            {
              id: 5521,
              condition: {
                op: 'equal',
                vars: [
                  {
                    value: 'Nej',
                  },
                  {
                    value: 'Nej',
                  },
                ],
              },
              action_type: 'add',
              target_question: 'hindersProvningNo',
            },
          ],
        },
      },
      {
        id: 'hindersProvningYes',
        position: 16,
        last: false,
        name: [
          'Perfekt! Vi behöver en kopia av er hindersprövning. I slutet av bokningen får du information om hur du skickar den till oss.',
        ],
        type: 'message',
        logics: {
          logic_type: 'question',
          actions: [
            {
              id: 1234,
              condition: {},
              action_type: 'jump',
              target_question: 'confirmBooking',
            },
          ],
        },
      },
      {
        id: 'hindersProvningNo',
        position: 17,
        last: false,
        name: [
          'Jag kan göra klart din bokning utan hindersprövning, men vigseln kan inte genomföras utan den.\n\nNi ansöker om hindersprövning på Skatteverkets webbplats[https://skatteverket.se/privat/folkbokforing/aktenskapochpartnerskap/forevigselnhindersprovning.4.76a43be412206334b89800020477.html?q=hinderspr%C3%B6vning] ',
        ],
        type: 'message',
      },
      // TODO: Lägg in divider här med titel: Summering
      {
        id: 'confirmBooking',
        position: 18,
        name: [
          ({ answers }) =>
            `Då har jag följande uppgifter om din bokning.\n\nDu och ${
              answers.partnerName.split(' ')[0]
            } vill gifta er ${
              answers.weddingLocationCustom
                ? answers.weddingLocationCustom
                : answers.weddingLocation
            } ${answers.weddingDate}. Ni kommer ha ${
              answers.guestsTotal
            } gäster, inklusive era vittnen.`,
          'Vill du bekräfta bokningen?',
        ],
        type: 'radio',
        last: false,
        options: [
          {
            value: 'Ja, boka vigsel',
            icon: 'check',
          },
          {
            value: 'Nej, jag vill spara och fortsätta senare',
            icon: 'close',
          },
        ],
        logics: {
          logic_type: 'question',
          actions: [
            {
              id: 1234,
              condition: {
                op: 'equal',
                vars: [
                  {
                    value: 'Ja, boka vigsel',
                  },
                  {
                    value: 'Ja, boka vigsel',
                  },
                ],
              },
              action_type: 'add',
              target_question: 'confirmBookingYes',
            },
            {
              id: 5521,
              condition: {
                op: 'equal',
                vars: [
                  {
                    value: 'Nej, jag vill spara och fortsätta senare',
                  },
                  {
                    value: 'Nej, jag vill spara och fortsätta senare',
                  },
                ],
              },
              action_type: 'add',
              target_question: 'confirmBookingNo',
            },
          ],
        },
      },
      // TODO: möjligör för en fråga att skifta text/name beroende på tidigare svar
      {
        id: 'confirmBookingYes',
        position: 19,
        name: [
          'Då har jag tagit emot er bokning. Du kan när som helst se din bokning under fliken Mitt HBG.',
          'Vi har också skickat en bekräftelse till din e-post.',
        ],
        type: 'message',
        last: true,
      },
      {
        id: 'confirmBookingNo',
        position: 20,
        name:
          'Okej, då sparar jag ditt ärende. Du kan när som helst komma tillbaka och göra klart det.',
        type: 'message',
        last: true,
      },
    ],
  },
];
export default forms;
