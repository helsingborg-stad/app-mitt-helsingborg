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

  if (group && title) {
    questions[1].details = {
      group,
      label: `${title} (kr)`,
      icon: false,
      show: true,
    };

    questions[2].details = {
      group,
      label: `${title} (datum)`,
      icon: false,
      show: true,
    };
  }

  return questions;
};

/**
 * Temporary methods to calculate payment sum and date
 * TODO: Temp fix, remove me later
 */
const lottery = () => Math.floor(Math.random() * 9999) + 0;
const getPaymentDate = () => {
  const d = new Date();
  d.setDate(d.getDate() + ((7 - d.getDay()) % 7) + 1);
  return d.toLocaleDateString('sv-SE');
};

const EKB_FORM = {
  id: 2,
  name: 'Ekonomiskt Bistånd',
  icon: 'attach-money',
  trigger: 'Vill ansöka om ekonomiskt bistånd',
  groups: [
    {
      name: 'income',
      title: 'Inkomster',
    },
    {
      name: 'expense',
      title: 'Utgifter',
    },
  ],
  questions: [
    /*
      Income
    */
    ...ekbQuestion({
      title: 'incomeSalary',
      group: 'income',
      key: 'incomeSalary',
      question: [
        'För att vi ska kunna hjälpa dig räkna ut om du kan få ekonomiskt bistånd behöver vi veta vilka pengar du får in de närmsta 30 dagarna.',
        'Får du lön idag från ett arbete eller annan inkomstkälla?',
      ],
    }),
    ...ekbQuestion({
      title: 'incomeRent',
      group: 'income',
      key: 'incomeRent',
      question: 'Inkomst Hyra?',
    }),
    ...ekbQuestion({
      title: 'incomeElectricity',
      group: 'income',
      key: 'incomeElectricity',
      question: 'Inkomst El?',
    }),
    ...ekbQuestion({
      title: 'incomePension',
      group: 'income',
      key: 'incomePension',
      question: 'Utländsk Pension?',
    }),
    ...ekbQuestion({
      title: 'incomeLoan',
      group: 'income',
      key: 'incomeLoan',
      question: 'Lånade pengar?',
    }),
    ...ekbQuestion({
      title: 'incomeOther',
      group: 'income',
      key: 'incomeOther',
      question: 'Övrig inkomst?',
    }),
    /*
      Expenses
    */
    ...ekbQuestion({
      title: 'expenseRent',
      group: 'expense',
      key: 'expenseRent',
      question: 'Utgifter Hyra?',
    }),
    ...ekbQuestion({
      title: 'expenseHomeInsurance',
      group: 'expense',
      key: 'expenseHomeInsurance',
      question: 'Utgifter Försäkring?',
    }),
    ...ekbQuestion({
      title: 'expenseInternet',
      group: 'expense',
      key: 'expenseInternet',
      question: 'Utgifter Internet?',
    }),
    ...ekbQuestion({
      title: 'expenseKidSupport',
      group: 'expense',
      key: 'expenseKidSupport',
      question: 'Utgifter Barn underhåll?',
    }),
    ...ekbQuestion({
      title: 'expenseTeeth',
      group: 'expense',
      key: 'expenseTeeth',
      question: 'Utgifter tandvård?',
    }),
    ...ekbQuestion({
      title: 'expenseMedical',
      group: 'expense',
      key: 'expenseMedical',
      question: 'Ugifter medicin?',
    }),
    ...ekbQuestion({
      title: 'expenseLoan',
      group: 'expense',
      key: 'expenseLoan',
      question: 'Ugifter lån?',
    }),
    ...ekbQuestion({
      title: 'expenseTravel',
      group: 'expense',
      key: 'expenseTravel',
      question: 'Ugifter resor?',
    }),
    ...ekbQuestion({
      title: 'expenseUnionFee',
      group: 'expense',
      key: 'expenseUnionFee',
      question: 'Ugifter A-kassa?',
    }),
    ...ekbQuestion({
      title: 'expenseOther',
      group: 'expense',
      key: 'expenseOther',
      question: 'Utgifter övrigt?',
    }),
    /**
     * Preiliminary calculation
     */
    {
      id: 'preliminaryCalculation',
      name: [
        `Enligt vår preliminära uträkning kommer du att få ut ${lottery()} kr och kommer utbetalas ${getPaymentDate()}.`,
      ],
      type: 'message',
    },
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
