const forms = [
  {
      id: 1,
      name: 'Bokning av borgerlig vigsel - Om er',
      trigger: 'Vill boka borgerlig vigsel',
      doneMessage: 'Då har jag tagit emot er bokning. Du kan när som helst se eller redigera din bokning under fliken Ärenden.',
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
              name: ({ answers }) => `Är ${answers.partnerName.split(' ')[0]} folkbokförd på samma adress som du?`,
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
            name: ({ answers }) => `Vilken adress är ${answers.partnerName.split(' ')[0]} folkbokförd på?`,
            type: 'text',
            placeholder: 'Adress',
            dependency: {
                relation: 'AND',
                conditions: [
                    {
                        'key': 'partnerSameAddress',
                        'value': 'Nej',
                        'compare': '='
                    }
                ]
            }
        },
        {
            id: 'weddingLocation',
            name: 'Var vill ni gifta er?',
            type: 'radio',
            options: [
                {
                    value: 'På Rådhuset',
                },
                {
                    value: 'Annan plats',
                },
            ],
        },
        {
            id: 'weddingDate',
            name: 'När vill ni gifta er?',
            type: 'datetime',
        },
        {
            id: 'guestsTotal',
            name: 'Hur många gäster kommer till er vigsel?',
            type: 'number',
            placeholder: 'Ange antal gäster',
            options: [
                {
                    value: '2 gäster',
                },
                {
                    value: '3 gäster',
                },
                {
                    value: '4 gäster',
                },
            ],
        },
        {
            id: 'hindersProvning',
            name: 'Har ni intyg för hindersprövning från Skatteverket? ',
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
            id: 'specialRequests',
            name: 'Har ni några speciella önskemål för er vigsel?',
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
            id: 'firstWitness',
            name: [
                'Under vigseln behöver ni ha två vittnen. För att jag ska kunna boka er vigsel behöver jag veta vad de heter.',
                'Vad heter ert första vittne?',
            ],
            type: 'text',
            placeholder: 'Vittne 1: För- och efternamn',
        },
        {
            id: 'secondWitness',
            name: 'Vad heter ert andra vittne?',
            type: 'text',
            placeholder: 'Vittne 2: För- och efternamn',
        },
        {
            id: 'confirmBooking',
            name: [
                'Du har nu gått igenom alla steg för att boka borgerlig vigsel.',
                ({answers}) => (`Du och ${answers.partnerName.split(' ')[0]} vill gifta er i ${answers.weddingLocation} ${answers.weddingDate}. Ni kommer ha ${answers.guestsTotal} gäster, inklusive era vittnen ${answers.firstWitness.split(' ')[0]} och ${answers.secondWitness.split(' ')[0]}.`),
                'Vill du boka vigsel?'
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
            ],
        },
      ],
  },
];
export default forms;
