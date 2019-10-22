const forms = [
  {
      id: 1,
      name: 'Borgerlig vigsel',
      trigger: 'Vill boka borgerlig vigsel',
      questions: [
          {
              key: 'partnerName',
              question: 'Vem ska du gifta dig med?',
              input: [
                  {
                      type: 'text',
                      placeholder: 'För- och efternamn',
                  },
              ],
          },
          {
              key: 'partnerSocialNumber',
              question: ({ answers }) => `Vilket personnummer har ${answers.partnerName.split(' ')[0]}?`,
              input: [
                  {
                      type: 'number',
                      placeholder: 'Personnummer',
                      maxLength: 12,
                  },
              ],
          },
          {
              key: 'partnerSameAddress',
              question: ({ answers }) => `Är ${answers.partnerName.split(' ')[0]} folkbokförd på samma adress som du?`,
              input: [
                  {
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
              ],
          },
          {
              key: 'weddingLocation',
              question: 'Var vill ni gifta er?',
              input: [
                  {
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
              ],
          },
          {
              key: 'weddingDate',
              question: 'När vill ni gifta er?',
              input: [
                  {
                      type: 'dateTime',
                  },
              ],
          },
          {
              key: 'guestsTotal',
              question: 'Hur många gäster kommer till er vigsel?',
              input: [
                  {
                      type: 'select',
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
              ],
          },
          {
              key: 'hindersProvning',
              question: 'Har ni intyg för hindersprövning från Skatteverket? ',
              input: [
                  {
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
              ],
          },
          {
              key: 'specialRequests',
              question: 'Har ni några speciella önskemål för er vigsel?',
              input: [
                  {
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
              ],
          },
          {
              key: 'firstWitness',
              question: [
                  'Under vigseln behöver ni ha två vittnen. För att jag ska kunna boka er vigsel behöver jag veta vad de heter.',
                  'Vad heter ert första vittne?',
              ],
              input: [
                  {
                      type: 'text',
                      placeholder: 'Vittne 1: För- och efternamn',
                  },
              ],
          },
          {
              key: 'secondWitness',
              question: 'Vad heter ert andra vittne?',
              input: [
                  {
                      type: 'text',
                      placeholder: 'Vittne 2: För- och efternamn',
                  },
              ],
          },
      ],
  },
];
export default forms;
