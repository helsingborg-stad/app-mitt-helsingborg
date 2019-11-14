const forms = [
  {
      id: 1,
      name: 'Borgerlig vigsel',
      trigger: 'Vill boka borgerlig vigsel',
      doneMessage: 'Då har jag tagit emot er bokning. Du kan när som helst se din bokning under fliken Min sida.',
      questions: [
        {
              id: 'partnerName',
              name: 'Vem ska du gifta dig med?',
              type: 'text',
              placeholder: 'För- och efternamn',
        },
        {
              id: 'partnerSocialNumber',
              name: ({ answers }) => `Vilket personnummer har ${answers.partnerName.split(' ')[0]}?`,
              type: 'number',
              placeholder: 'Personnummer',
              maxLength: 12,
        },
        {
              id: 'partnerSameAddress',
              name: ({ answers }) => `Har ${answers.partnerName.split(' ')[0]} samma adress som du?`,
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
            name: ({ answers }) => `Vilken gatuadress har ${answers.partnerName.split(' ')[0]}?`,
            type: 'text',
            placeholder: 'Adress',
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
            name: ({ answers }) => `Vilket postnummer har ${answers.partnerName.split(' ')[0]}?`,
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
            name: ({ answers }) => `Vilken ort bor ${answers.partnerName.split(' ')[0]} på?`,
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
                    value: 'På Rådhuset i Helsingborg',
                },
                {
                    value: 'Annan plats',
                },
            ],
        }, 
        {
            id: 'weddingLocationCustom',
            name: 'Var vill ni gifta er?',
            type: 'text',
            placeholder: 'Val av plats',
            dependency: {
                relation: 'AND',
                conditions: [{
                    'key': 'weddingLocation',
                    'value': 'Annan plats',
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
            name: 'Ni behöver ha två vittnen under er vigsel. Har ni bestämt vilka vittnen ni vill ha?',
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
            id: 'firstWitness',
            name: [
                'Under vigseln behöver ni ha två vittnen. För att jag ska kunna boka er vigsel behöver jag veta vad de heter.',
                'Vad heter ert första vittne?',
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
            name: 'Vad heter ert andra vittne?',
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
                'Hur många gäster kommer till er vigsel?'
            ],
            type: 'number',
            placeholder: 'Ange antal gäster',
            dependency: {
                relation: 'AND',
                conditions: [{
                    'key': 'weddingLocation',
                    'value': 'På Rådhuset i Helsingborg',
                    'compare': '='
                }]
            },
            explainer: [
                {
                    key: 0,
                    heading: 'Gäster',
                    content: 'I Rådhusets vigselsal får det max vara 20 personer samtidigt. Ni kan därför som mest ha 17 gäster till er vigsel, inklusive barn och era vittnen.',
                }
            ]
        },
        {
            id: 'hasSpecialRequests',
            name: 'Har ni några speciella önskemål för er vigsel?',
            type: 'radio',
            options: [{
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
                    heading: 'Önskemål',
                    content: 'Önskemål för er vigsel kan till exempel vara att ni vill ha musik vid vigseln, att ni vill ha ert vigselbevis på engelska eller om ni vill ha en specifik vigselförrättare.\nEfter er bokningsbekräftelse kan ni kan kontakta er vigselförrättare om ni har särskilda önskemål.Det går också bra att kontakta Helsingborgs kontaktcenter här i appen, via telefon eller mejl.',
                }
            ]
        },
        {
            key: 'speciaRequests',
            name: false,
            type: 'text',
            placeholder: 'Ange önskemål',
            dependency: {
                relation: 'AND',
                conditions: [{
                    'key': 'hasSpecialRequests',
                    'value': 'Ja',
                    'compare': '='
                }]
            }
        },
        {
            id: 'hindersProvning',
            name: [
                'Innan ni gifter er måste Skatteverket intyga att det inte finns några hinder för giftemål',
                'Har ni intyg för hindersprövning från Skatteverket?'
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
        },
        {
            id: 'confirmBooking',
            name: [
                'Då har jag följande uppgifter om din bokning',
                ({
                    answers
                }) => (`Du och ${answers.partnerName.split(' ')[0]} vill gifta er ${answers.weddingLocationCustom ? answers.weddingLocationCustom : answers.weddingLocation} ${answers.weddingDate}`),
                'Vill du skicka bokningsförfrågan?'
            ],
            type: 'radio',
            options: [
                {
                    value: 'Ja, boka vigsel',
                    icon: 'check',
                },
                {
                    value: 'Nej, spara bokning och vänta till senare',
                    icon: 'close',
                },
            ]
        }
    ],
}, ];
export default forms;
