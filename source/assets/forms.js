const forms = [{
    id: 1,
    name: 'Bokning borgerlig vigsel startad',
    trigger: 'Vill boka borgerlig vigsel',
    doneMessage: 'Då har jag tagit emot er bokning, du kan när som helst se eller redigera din bokning under fliken Mitt HBG',
    questions: [{
            key: 'partnerName',
            question: 'Vem ska du gifta dig med?',
            input: [{
                type: 'text',
                placeholder: 'För- och efternamn',
            }, ],
        },
        {
            key: 'partnerSocialNumber',
            question: ({
                answers
            }) => `Vilket personnummer har ${answers.partnerName.split(' ')[0]}?`,
            input: [{
                type: 'number',
                placeholder: 'Personnummer',
                maxLength: 12,
            }, ],
        },
        {
            key: 'partnerSameAddress',
            question: ({
                answers
            }) => `Bor ${answers.partnerName.split(' ')[0]} på samma adress som du?`,
            input: [{
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
            }, ],
        },
        {
            key: 'partnerAddress',
            question: ({
                answers
            }) => `Vilken gatuadress har ${answers.partnerName.split(' ')[0]}?`,
            input: [{
                type: 'text',
                placeholder: 'Gatuadress',
            }, ],
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
            key: 'partnerPostal',
            question: 'Vilket postnummer?',
            input: [{
                type: 'number',
                placeholder: 'Postnummer',
                maxLength: 5
            }, ],
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
            key: 'partnerCity',
            question: 'Ort?',
            input: [{
                type: 'text',
                placeholder: 'Ort',
            }, ],
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
            key: 'weddingLocation',
            question: 'Var vill ni gifta er?',
            input: [{
                type: 'radio',
                options: [{
                        value: 'På Rådhuset i Helsingborg',
                    },
                    {
                        value: 'Annan plats',
                    },
                ],
            }, ],
        },
        {
            key: 'weddingLocationCustom',
            question: 'Var vill ni gifta er?',
            input: [{
                type: 'text',
                placeholder: 'Val av plats',
            }, ],
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
            key: 'weddingDate',
            question: 'Vilket datum vill ni gifta er?',
            input: [{
                type: 'dateTime',
            }, ],
        },
        {
            key: 'hasWitness',
            question: 'Ni behöver ha två vittnen under er vigsel. Har ni bestämt vilka vittnen ni vill ha?',
            input: [{
                type: 'radio',
                options: [{
                        value: 'Ja',
                        icon: 'check',
                    },
                    {
                        value: 'Nej jag vill komplettera senare',
                        icon: 'close',
                    },
                ],
            }, ],
        },
        {
            key: 'firstWitness',
            question: [
                'Under vigseln behöver ni ha två vittnen. För att jag ska kunna boka er vigsel behöver jag veta vad de heter.',
                'Vad heter ert första vittne?',
            ],
            input: [{
                type: 'text',
                placeholder: 'Vittne 1: För- och efternamn',
            }, ],
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
            key: 'secondWitness',
            question: 'Vad heter ert andra vittne?',
            input: [{
                type: 'text',
                placeholder: 'Vittne 2: För- och efternamn',
            }, ],
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
            key: 'guestsTotal',
            question: [
                'I Rådhusets vigselsal får det max vara 20 personer samtidigt. Ni kan därför som mest ha 17 gäster till er vigsel, inklusive barn och era vittnen.',
                'Hur många gäster kommer till er vigsel?'
            ],
            input: [{
                type: 'number',
                placeholder: 'Ange antal gäster',
            }, ],
            dependency: {
                relation: 'AND',
                conditions: [{
                    'key': 'weddingLocation',
                    'value': 'På Rådhuset i Helsingborg',
                    'compare': '='
                }]
            }
        },
        {
            key: 'hasSpecialRequests',
            question: 'Har ni några speciella önskemål för er vigsel?',
            input: [{
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
            }, ],
        },
        {
            key: 'speciaRequests',
            question: false,
            input: [{
                type: 'text',
                placeholder: 'Ange önskemål',
            }, ],
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
            key: 'hindersProvning',
            question: [
                'Innan ni gifter er måste Skatteverket intyga att det inte finns några hinder för giftemål',
                'Har ni intyg för hindersprövning från Skatteverket?'
            ],
            input: [{
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
            }, ],
        },
        {
            key: 'confirmBooking',
            question: [
                'Då har jag följande uppgifter om din bokning',
                ({
                    answers
                }) => (`Du och ${answers.partnerName.split(' ')[0]} vill gifta er ${answers.weddingLocationCustom ? answers.weddingLocationCustom : answers.weddingLocation} ${answers.weddingDate}`),
                'Vill du skicka bokningsförfrågan?'
            ],
            input: [{
                type: 'radio',
                options: [{
                        value: 'Ja, skicka bokningsförfrågan',
                        icon: 'check',
                    },
                    {
                        value: 'Nej, spara bokning och vänta till senare',
                        icon: 'close',
                    },
                ],
            }, ],
        },
    ],
}, ];
export default forms;