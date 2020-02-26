import ICON_RINGS_PNG from '../icon-rings/icon-rings-24x24_2x.png';

const ekbQuestion = args => {
  const { key, question, group, title } = args;

  const dependency = {
    relation: 'AND',
    conditions: [
      {
        key,
        value: 'Ja',
        compare: '=',
      },
    ],
  };

  const questions = [
    {
      id: key,
      name: question,
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
      id: `${key}Value`,
      name: 'Hur mycket?',
      type: 'number',
      dependency,
      placeholder: 'Ange summa',
    },
    {
      id: `${key}Date`,
      name: 'När?',
      type: 'date',
      dependency,
      placeholder: 'Ange datum',
    },
  ];

  // if (group && title) {
  //   questions.push({
  //     group,
  //     label: title,
  //     icon: 'location-on',
  //     show: true,
  //   });
  // }

  return questions;
};

const EKB_FORM = {
  id: 2,
  name: 'Ekonomiskt Bistånd',
  imageIcon: ICON_RINGS_PNG,
  trigger: 'Vill ansöka om ekonomiskt bistånd',
  questions: [
    /* 
      Income 
    */
    ...ekbQuestion({
      key: 'incomeSalary',
      question: [
        'För att vi ska kunna hjälpa dig räkna ut om du kan få ekonomiskt bistånd behöver vi veta vilka pengar du får in de närmsta 30 dagarna.',
        'Får du lön idag från ett arbete eller annan inkomstkälla?',
      ],
    }),
    ...ekbQuestion({
      title: 'incomeRent',
      key: 'incomeRent',
      question: 'Inkomst Hyra?',
    }),
    ...ekbQuestion({
      title: 'incomeElectricity',
      key: 'incomeElectricity',
      question: 'Inkomst El?',
    }),
    ...ekbQuestion({
      title: 'incomePension',
      key: 'incomePension',
      question: 'Utländsk Pension?',
    }),
    ...ekbQuestion({
      title: 'incomeLoan',
      key: 'incomeLoan',
      question: 'Lånade pengar?',
    }),
    ...ekbQuestion({
      title: 'incomeOther',
      key: 'incomeOther',
      question: 'Övrig inkomst?',
    }),
    /* 
      Expenses 
    */
    ...ekbQuestion({
      title: 'expenseRent',
      key: 'expenseRent',
      question: 'Utgifter Hyra?',
    }),
    ...ekbQuestion({
      title: 'expenseHomeInsurance',
      key: 'expenseHomeInsurance',
      question: 'Utgifter Försäkring?',
    }),
    ...ekbQuestion({
      title: 'expenseInternet',
      key: 'expenseInternet',
      question: 'Utgifter Internet?',
    }),
    ...ekbQuestion({
      title: 'expenseKidSupport',
      key: 'expenseKidSupport',
      question: 'Utgifter Barn underhåll?',
    }),
    ...ekbQuestion({
      title: 'expenseTeeth',
      key: 'expenseTeeth',
      question: 'Utgifter tandvård?',
    }),
    ...ekbQuestion({
      title: 'expenseMedical',
      key: 'expenseMedical',
      question: 'Ugifter medicin?',
    }),
    ...ekbQuestion({
      title: 'expenseLoan',
      key: 'expenseLoan',
      question: 'Ugifter lån?',
    }),
    ...ekbQuestion({
      title: 'expenseTravel',
      key: 'expenseTravel',
      question: 'Ugifter resor?',
    }),
    ...ekbQuestion({
      title: 'expenseUnionFee',
      key: 'expenseUnionFee',
      question: 'Ugifter A-kassa?',
    }),
    ...ekbQuestion({
      key: 'expenseOther',
      question: 'Utgifter övrigt?',
    }),

    /**
     * Confirm
     */
    {
      name: data => {
        const { answers } = data;
        return JSON.stringify(answers);
      },
      id: 'confirmBooking',
      type: 'radio',
      options: [
        {
          value: 'Skicka in ansökan',
          icon: 'check',
        },
        {
          value: 'Nej, jag vill spara och fortsätta senare',
          icon: 'close',
        },
      ],
    },
    {
      id: 'confirmBookingYes',
      name: [
        'Då har jag tagit emot er bokning. Du kan när som helst se din bokning under fliken Mitt HBG.',
      ],
      type: 'message',
      dependency: {
        relation: 'AND',
        conditions: [
          {
            key: 'confirmBooking',
            value: 'Skicka in ansökan',
            compare: '=',
          },
        ],
      },
    },
    {
      id: 'confirmBookingNo',
      name:
        'Okej, då sparar jag ditt ärende. Du kan när som helst komma tillbaka och göra klart det.',
      type: 'message',
      dependency: {
        relation: 'AND',
        conditions: [
          {
            key: 'confirmBooking',
            value: 'Nej, jag vill spara och fortsätta senare',
            compare: '=',
          },
        ],
      },
    },
  ],
};

export default EKB_FORM;
