const formEkbMockData = {
  steps: [
    {
      id: '1',
      title: 'Vill du ansöka om Ekonomiskt bistånd igen?',
      description:
        'Du kommer behöva ange inkomster, utgifter och kontrollera dina boende detaljer.',
      group: 'Ansökan',
      image: '',
      icon: '',
      actions: [
        {
          type: 'next',
          label: 'Ja, starta ansökan',
        },
      ],
      fields: [],
      theme: {
        step: {
          bg: '#FFAA9B',
          banner: {},
          footer: {},
          text: {
            colors: {
              primary: '#00213f',
              secondary: '#733232',
            },
          },
        },
      },
    },
    {
      id: '2',
      title: 'Hej',
      description: `Först börjar vi med att bekräfta dina uppgifter. \n Stämmer det här? `,
      group: 'Ekonomist bistånd',
      image: '',
      icon: '',
      action: [
        {
          type: 'next',
          label: 'Ja, allt stämmer',
        },
        {
          type: 'change',
          label: 'Nej, jag behöver ändra något',
        },
      ],
      fields: [],
      theme: {
        step: {
          bg: '#FFAA9B',
          banner: {},
          footer: {},
          text: {
            colors: {
              primary: '#00213f',
              secondary: '#733232',
            },
          },
        },
      },
    },
  ],
};

export default formEkbMockData;
