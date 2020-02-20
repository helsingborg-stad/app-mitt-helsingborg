import ICON_RINGS_PNG from './icon-rings/icon-rings-24x24_2x.png';

const ekbQuestion = args => {
  const { key, question } = args;

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
      type: 'number',
      dependency,
      placeholder: 'Ange datum',
    },
  ];

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
      key: 'incomeRent',
      question: 'Hyra',
    }),
    ...ekbQuestion({
      key: 'incomeElectricity',
      question: 'El',
    }),
    ...ekbQuestion({
      key: 'incomePension',
      question: 'Utländsk Pension',
    }),
    ...ekbQuestion({
      key: 'incomeLoan',
      question: 'Lånade pengar',
    }),
    ...ekbQuestion({
      key: 'incomeOther',
      question: 'Övrigt',
    }),
    /* 
      Expenses 
    */
    ...ekbQuestion({
      key: 'expenseRent',
      question: 'Hyra',
    }),
    ...ekbQuestion({
      key: 'expenseHomeInsurance',
      question: 'Hyra',
    }),
    ...ekbQuestion({
      key: 'expenseInternet',
      question: 'Hyra',
    }),
    ...ekbQuestion({
      key: 'expenseKidSupport',
      question: 'Hyra',
    }),
    ...ekbQuestion({
      key: 'expenseTeeth',
      question: 'Hyra',
    }),
    ...ekbQuestion({
      key: 'expenseMedical',
      question: 'Hyra',
    }),
    ...ekbQuestion({
      key: 'expenseLoan',
      question: 'Hyra',
    }),
    ...ekbQuestion({
      key: 'expenseTravel',
      question: 'Hyra',
    }),
    ...ekbQuestion({
      key: 'expenseUnionFee',
      question: 'Hyra',
    }),
    ...ekbQuestion({
      key: 'expenseOther',
      question: 'Har du andra utgifter?',
    }),
  ],
};

export default EKB_FORM;
