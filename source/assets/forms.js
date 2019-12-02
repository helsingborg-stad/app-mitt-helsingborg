import { sanitizePin } from "../helpers/ValidationHelper";
import ICON_RINGS_PNG from './icon-rings/icon-rings-24x24_2x.png';

const forms = [
  {
      id: 1,
      name: 'Borgerlig vigsel',
      imageIcon: ICON_RINGS_PNG,
      trigger: 'Vill boka borgerlig vigsel',
      questions: [
        {
            id: 'partnerName',
            name: 'Vi börjar med information om din partner. Vad heter personen du ska gifta dig med?',
            details: {
                group: "partner",
                label: "Namn",
                icon: "person",
                show: true
            },
            type: 'text',
            placeholder: 'För- och efternamn',
            validations: [
                {
                    method: 'matches',
                    args: ["(\\w.+\\s).+", 'i'],
                    message: "Ange både för- och efternamn.",
                    valid_when: true
                }
            ]
        },
        {
            id: 'partnerSocialNumber',
            name: ({ answers }) => `Vilket personnummer har ${answers.partnerName.split(' ')[0]}?`,
            details: {
                group: "partner",
                label: "Personummer",
                icon: "done",
                show: true
            },
            label: "Personnummer",
            type: 'number',
            placeholder: 'ÅÅÅÅMMDDXXXX',
            maxLength: 12,
            // TODO: Lift out arrow functions for formatting to ChatUserInput
            withForm: {
                filterChangeHandler: value => (sanitizePin(value))
            },
            validations: [
                {
                    method: "isLength",
                    args: [{
                        min: 12,
                        max: 12
                    }],
                    message: "Felaktigt personnummer. Ange format ÅÅÅÅMMDDXXXX.",
                    valid_when: true
                },
                {
                    method: "isNumeric",
                    args: [{
                        no_symbols: true,
                    }],
                    message: "Du måste ange siffror. Bokstäver är ej tillåtet.",
                    valid_when: true
                }
            ]
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
            details: {
                group: "partner",
                label: "Gatuadress",
                icon: "location-on",
                show: true
            },
            placeholder: 'Gatuadress',
            dependency: {
                relation: 'AND',
                conditions: [{
                    'key': 'partnerSameAddress',
                    'value': 'Nej',
                    'compare': '='
                }]
            },
        },
        {
            id: 'partnerPostal',
            name: false,
            type: 'number',
            placeholder: 'Postnummer',
            details: {
                group: "partner",
                label: "Postnummer",
                icon: "location-on",
                show: true
            },
            dependency: {
                relation: 'AND',
                conditions: [{
                    'key': 'partnerSameAddress',
                    'value': 'Nej',
                    'compare': '='
                }]
            },
            validations: [
                {
                    method: "isLength",
                    args: [{
                        min: 5, max: 5
                    }],
                    message: "Du måste ange ett giltigt postnummer.",
                    valid_when: true
                }
            ]
        },
        {
            id: 'partnerCity',
            name: false,
            type: 'text',
            placeholder: 'Ort',
            details: {
                group: "partner",
                label: "Ort",
                icon: "location-on",
                show: true
            },
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
            name: 'Okej, då går vi vidare till vigseln.\n\nVar vill ni gifta er?',
            type: 'radio',
            details: {
                group: "wedding",
                label: "Plats",
                icon: "location-on",
                show: true
            },
            options: [{
                    value: 'Rådhuset i Helsingborg',
                },
                {
                    value: 'Egen vald plats',
                },
            ],
            explainer: [
                {
                    key: 0,
                    heading: 'Plats för vigsel',
                    content: `Om ni inte vill gifta er i Rådhuset kan ni ange önskad plats i bokningen. Vi kan oftast tillgodose önskemål om egen vald plats.
                    &nbsp;
                    När du har skickat in din bokningsförfrågan tar vi kontakt med dig för att bekräfta plats för vigsel.`,
                }
            ]
        },
        {
            id: 'weddingLocationCustom',
            name: 'Vilken plats vill ni gifta er på?',
            type: 'text',
            placeholder: 'Val av plats',
            details: {
                group: "wedding",
                label: "Egen vald plats",
                icon: "location-on",
                show: true
            },
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
            type: 'date',
            details: {
                group: "wedding",
                label: "Datum för vigsel",
                icon: "event",
                show: true
            },
            selectorProps: {
                locale: 'sv',
                // TODO: Lift out date object
                minimumDate: new Date(),
            },
            explainer: [
                {
                    key: 0,
                    heading: 'Tid',
                    content:
                    `Ni kan bli vigda i Rådhuset följande tider:
                    &nbsp;
                    &nbsp;
                    **Vardagar:** 16:00 och 16:30.
                    &nbsp;
                    **Lördagar:** 14:00, 14:30, 15:00 och 15.30.
                    &nbsp;
                    **Dag före röd dag:** 11:30.
                    &nbsp;
                    &nbsp;
                    Under **storhelger är Rådhuset stängt**, men ni kan välja att istället boka vigsel på annan plats.
                    `,
                }
            ]
        },
        {
            id: 'weddingTime',
            name: 'Vilken tid?',
            type: 'time',
            details: {
                group: "wedding",
                label: "Tid för vigsel",
                icon: "access-time",
                show: true
            },
            selectorProps: {
                minuteInterval: 30,
                locale: 'sv',
            },
        },
          {
              id: 'weddingLocationCustomInfo',
              name: 'Bra, då vet jag. Efter att du har skickat in din bokningsförfrågan kontaktar vi dig för att bekräfta vi kan viga er på önskad plats och dag.',
              type: 'message',
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
                    content: `**Ni behöver ha två vittnen vid er vigsel**, och det är ni som brudpar som ansvarar för att ni har vittnen under vigseln.
                    &nbsp;
                    **Era vittnen måste vara över 15 år**.
                    &nbsp;
                    För att vi ska kunna trycka vigselbeviset behöver vi namn på era vittnen **senast 3 dagar innan vigseln**.
                    &nbsp;
                    Om du inte vill ange vittnen när du bokar, kan du komplettera det senare.`,
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
                'Vad heter era vittnen? Ange ett namn i taget.',
            ],
            type: 'text',
            details: {
                group: "witness",
                label: "Första vittne",
                icon: "person",
                show: true
            },
            placeholder: 'Vittne 1: För- och efternamn',
            dependency: {
                relation: 'AND',
                conditions: [{
                    'key': 'hasWitness',
                    'value': 'Ja',
                    'compare': '='
                }]
            },
            validations: [
                {
                    method: "matches",
                    args: ["(\\w.+\\s).+", 'i'],
                    message: "Ange både för- och efternamn.",
                    valid_when: true
                }
            ]
        },
        {
            id: 'secondWitness',
            name: false,
            type: 'text',
            placeholder: 'Vittne 2: För- och efternamn',
            details: {
                group: "witness",
                label: "Andra vittne",
                icon: "person",
                show: true
            },
            dependency: {
                relation: 'AND',
                conditions: [{
                    'key': 'hasWitness',
                    'value': 'Ja',
                    'compare': '='
                }]
            },
            validations: [
                {
                    method: "matches",
                    args: ["(\\w.+\\s).+", 'i'],
                    message: "Ange både för- och efternamn.",
                    valid_when: true
                }
            ]
        },
        {
            id: 'guestsTotal',
            name: [
                'I Rådhusets vigselsal får det vara 20 personer samtidigt. Ni kan därför som mest ha 17 gäster till er vigsel, inklusive barn och era vittnen.',
                'Hur många gäster kommer till er vigsel?'
            ],
            type: 'number',
            placeholder: 'Antal',
            details: {
                group: "wedding",
                label: "Antal gäster",
                icon: "group",
                show: true
            },
            dependency: {
                relation: 'AND',
                conditions: [{
                    'key': 'weddingLocation',
                    'value': 'Rådhuset i Helsingborg',
                    'compare': '='
                }]
            },
            validations: [
                {
                    method: "isInt",
                    args: [{min: 0, max: 17}],
                    message: "I Rådhuset får ni som mest ha 17 gäster. Ange antal mellan 2-17.",
                    valid_when: true
                }
            ]
        },
        {
            id: 'hindersProvning',
            name: [
                'En sista fråga, innan ni gifter er måste Skatteverket intyga att det inte finns några hinder för giftermål.\n\nHar ni intyg för hindersprövning?'
            ],
            type: 'radio',
            details: {
                group: "wedding",
                label: "Intyg för hindersprovning",
                icon: "done",
                show: true
            },
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
                    content: `Innan ni gifter er måste Skatteverket göra en hindersprövning, för att se till att det inte finns några hinder för äktenskapet.
                    &nbsp;
                    Ni ansöker om hindersprövning genom att fylla i en blankett som ni skickar till Skatteverket.
                    &nbsp;
                    Du hittar blanketten, och mer information om hindersprövning, på [Skatteverkets webbplats](https://skatteverket.se/privat/folkbokforing/aktenskapochpartnerskap/forevigselnhindersprovning.4.76a43be412206334b89800020477.html?q=hinderspr%C3%B6vning).`,
                }
            ]
        },
        {
              id: 'hindersProvningYes',
              name: [
                  'Perfekt! Vi behöver en kopia av er hindersprövning. Skicka den till:\nHelsingborg kontaktcenter\nStortorget 17\n251 89 Helsingborg',
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
              name:
                 `Jag kan göra klart din bokning utan hindersprövning, men vigseln kan inte genomföras utan den.\n\nNi ansöker om hindersprövning på [Skatteverkets webbplats](https://skatteverket.se/privat/folkbokforing/aktenskapochpartnerskap/forevigselnhindersprovning.4.76a43be412206334b89800020477.html?q=hinderspr%C3%B6vning).`,
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
                (data) => `Då har jag följande uppgifter om din bokning. 
                &nbsp;
                Vigsel för: ${data.user.given_name} och ${data.answers.partnerName.split(' ')[0]}
                Plats: ${data.answers.weddingLocationCustom || data.answers.weddingLocation}
                Datum: ${data.answers.weddingDate}
                Tid: ${data.answers.weddingTime}${data.answers.guestsTotal ? `
                Antal gäster, inklusive vittnen: ` + data.answers.guestsTotal + ' personer' : `${'&#8203;'}`}
                Vittnen: ${data.answers.hasWitness === 'Ja' ? data.answers.firstWitness + ' och ' + data.answers.secondWitness : 'Anger senare'}`,
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
            name: ['Då har jag tagit emot er bokning. Du kan när som helst se din bokning under fliken Mitt HBG.'],
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
