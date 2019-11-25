import { sanitizePin } from "../helpers/ValidationHelper";
import { Alert } from 'react-native';

const forms = [
  {
      id: 1,
      name: 'Borgerlig vigsel',
      trigger: 'Vill boka borgerlig vigsel',
      questions: [
        {
              id: 'partnerName',
              name: 'Vi börjar med information om din partner. Vad heter personen du ska gifta dig med?',
              type: 'text',
              placeholder: 'För- och efternamn',
        },
        {
              id: 'partnerSocialNumber',
              name: ({ answers }) => `Vilket personnummer har ${answers.partnerName.split(' ')[0]}?`,
              type: 'number',
              placeholder: 'Personnummer',
              maxLength: 12,
              // TODO: Lift out arrow functions for validation/formatting to ChatUserInput
              withForm: {
                validateSubmitHandlerInput: value => (value.length === 12 ? true : Alert.alert('Felaktigt personnummer. Ange format ÅÅÅÅMMDDXXXX.') && false),
                filterChangeHandler: value => (sanitizePin(value))
              }
        },
        {
              id: 'partnerSameAddress',
              name: ({ answers }) => `Bor ${answers.partnerName.split(' ')[0]} på samma adress som du?`,
              type: 'radio',
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
        },
        {
            id: 'partnerAddress',
            name: ({ answers }) => `Vilken adress har ${answers.partnerName.split(' ')[0]}?`,
            type: 'text',
            placeholder: 'Gatuadress',
            dependency: {
                relation: 'AND',
                conditions: [{
                    'key': 'partnerSameAddress',
                    'value': 'Nej',
                    'compare': '='
                }]
            }
        },
        {
            id: 'partnerPostal',
            name: false,
            type: 'number',
            placeholder: 'Postnummer',
            dependency: {
                relation: 'AND',
                conditions: [{
                    'key': 'partnerSameAddress',
                    'value': 'Nej',
                    'compare': '='
                }]
            }
        },
        {
            id: 'partnerCity',
            name: false,
            type: 'text',
            placeholder: 'Ort',
            dependency: {
                relation: 'AND',
                conditions: [{
                    'key': 'partnerSameAddress',
                    'value': 'Nej',
                    'compare': '='
                }]
            }
        },
        {
            id: 'weddingLocation',
            name: 'Var vill ni gifta er?',
            type: 'radio',
            options: [{
                    value: 'Rådhuset i Helsingborg',
                },
                {
                    value: 'Egen vald plats',
                },
            ],
        },
        {
            id: 'weddingLocationCustom',
            name: 'Vilken plats vill ni gifta er på?',
            type: 'text',
            placeholder: 'Val av plats',
            dependency: {
                relation: 'AND',
                conditions: [{
                    'key': 'weddingLocation',
                    'value': 'Egen vald plats',
                    'compare': '='
                }]
            }
        },
        {
            id: 'weddingDate',
            name: 'Vilket datum vill ni gifta er?',
            type: 'datetime',
            explainer: [
                {
                    key: 0,
                    heading: 'Tid',
                    content: 'Ni kan bli vigda i Rådhuset följande tider:\nVardagar klockan 16 och 16: 30. Under sommaren 15:30 och 16.\nLördagar klockan 14, 14: 30, 15 och 15.30.\nDag före röd dag klockan 11: 30.\n\nUnder storhelger är Rådhuset stängt, men ni kan välja att istället boka vigsel på annan plats. ',
                }
            ]
        },
        {
            id: 'hasWitness',
            name: 'Ni behöver ha två vittnen under er vigsel.\n\nHar ni bestämt vilka vittnen ni vill ha?',
            type: 'radio',
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
                    content: 'Två vittnen måste närvara vid den borgerliga vigseln och det är brudparet som ansvarar för att vittnen finns. Vi behöver namn på era vittnen innan vigsel, men det går bra att komplettera med det efter att bokning är gjord. Vittnena ska vara över 15 år.',
                }
            ]
        },
        {
            id:  'hasNoWitness',
            name: 'Okej, då kan du göra detta senare.\n\nFör att vi ska kunna trycka ert vigselbevis behöver vi era vittnens namn senast 3 dagar innan vigsel.\n\nVi påminner dig i tid så att du inte glömmer.',
            type: 'message',
            dependency: {
                relation: 'AND',
                conditions: [{
                    'key': 'hasWitness',
                    'value': 'Nej jag vill komplettera senare',
                    'compare': '='
                }]
            }
        },
         {
            id: 'firstWitness',
            name: [
                'Vad heter era vittnen?',
            ],
            type: 'text',
            placeholder: 'Vittne 1: För- och efternamn',
            dependency: {
                relation: 'AND',
                conditions: [{
                    'key': 'hasWitness',
                    'value': 'Ja',
                    'compare': '='
                }]
            }
        },
        {
            id: 'secondWitness',
            name: false,
            type: 'text',
            placeholder: 'Vittne 2: För- och efternamn',
            dependency: {
                relation: 'AND',
                conditions: [{
                    'key': 'hasWitness',
                    'value': 'Ja',
                    'compare': '='
                }]
            }
        },
        {
            id: 'guestsTotal',
            name: [
                'I Rådhusets vigselsal får det vara 20 personer samtidigt. Ni kan därför som mest ha 17 gäster till er vigsel, inklusive barn och era vittnen.',
                'Hur många gäster kommer till er vigsel?'
            ],
            type: 'number',
            placeholder: 'Ange antal gäster',
            dependency: {
                relation: 'AND',
                conditions: [{
                    'key': 'weddingLocation',
                    'value': 'Rådhuset i Helsingborg',
                    'compare': '='
                }]
            },
        },
        {
            id: 'hindersProvning',
            name: [
                'Innan ni gifter er måste Skatteverket intyga att det inte finns några hinder för giftermål.\n\nHar ni intyg för hindersprövning?'
            ],
            type: 'radio',
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
                    content: 'Innan ni gifter er måste Skatteverket göra en hindersprövning, för att se till att det inte finns några hinder för äktenskapet. Ni ansöker om hindersprövning genom att fylla i en blankett som ni skickar till Skatteverket. Du hittar blanketten, och mer information om hindersprövning, på Skatteverkets webbplats.',
                }
            ]
        },
        {
              id: 'hindersProvningYes',
              name: [
                  'Perfekt! Vi behöver en kopia av er hindersprövning. I slutet av bokningen får du information om hur du skickar den till oss.',
              ],
              type: 'message',
              dependency: {
                  relation: 'AND',
                  conditions: [{
                      'key': 'hindersProvning',
                      'value': 'Ja',
                      'compare': '='
                  }]
              }
        },
        {
              id: 'hindersProvningNo',
              name: [
                 'Jag kan göra klart din bokning utan hindersprövning, men vigseln kan inte genomföras utan den.\n\nNi ansöker om hindersprövning på Skatteverkets webbplats[https://skatteverket.se/privat/folkbokforing/aktenskapochpartnerskap/forevigselnhindersprovning.4.76a43be412206334b89800020477.html?q=hinderspr%C3%B6vning] ',
              ],
              type: 'message',
              dependency: {
                  relation: 'AND',
                  conditions: [{
                      'key': 'hindersProvning',
                      'value': 'Nej',
                      'compare': '='
                  }]
              }
          },
        // TODO: Lägg in divider här med titel: Summering
        {
            id: 'confirmBooking',
            name: [
                ({
                    answers
                }) => (`Då har jag följande uppgifter om din bokning.\n\nDu och ${answers.partnerName.split(' ')[0]} vill gifta er ${answers.weddingLocationCustom ? answers.weddingLocationCustom : answers.weddingLocation} ${answers.weddingDate}. Ni kommer ha ${answers.guestsTotal} gäster, inklusive era vittnen.`),
                'Vill du bekräfta bokningen?'
            ],
            type: 'radio',
            options: [
                {
                    value: 'Ja, boka vigsel',
                    icon: 'check',
                },
                {
                    value: 'Nej, jag vill spara och fortsätta senare',
                    icon: 'close',
                },
            ]
        },
        {
            id: 'confirmBookingYes',
            name: [
            'Då har jag tagit emot er bokning. Du kan när som helst se din bokning under fliken Mitt HBG.',
            'Vi har också skickat en bekräftelse till din e-post.'],
            type: 'message',
            dependency: {
                relation: 'AND',
                conditions: [{
                    'key': 'confirmBooking',
                    'value': 'Ja, boka vigsel',
                    'compare': '='
                }]
            }
        },
        {
            id: 'confirmBookingNo',
            name: 'Okej, då sparar jag ditt ärende. Du kan när som helst komma tillbaka och göra klart det.',
            type: 'message',
            dependency: {
                relation: 'AND',
                conditions: [{
                    'key': 'confirmBooking',
                    'value': 'Nej, jag vill spara och fortsätta senare',
                    'compare': '='
                }]
            }
        },
    ],
}, ];
export default forms;