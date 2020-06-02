const formEkbMockData = {
  steps: [
    {
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
  ],
};

export default formEkbMockData;
