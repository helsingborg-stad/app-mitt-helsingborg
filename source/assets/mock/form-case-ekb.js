const ICON_EKB = require('source/assets/images/icons/icn_Main_ekonomiskt-bistand_1x.png');
const ICON_BREIF = require('source/assets/images/icons/icn_sammanstallning_1x.png');

const formEkbMockData = {
  steps: [
    {
      title: 'Vill du ansöka om Ekonomiskt bistånd igen?',
      description:
        'Du kommer behöva ange inkomster, utgifter och kontrollera dina boende detaljer.',
      group: 'Ansökan',
      image: '',
      icon: ICON_EKB,
      actions: [
        {
          type: 'start',
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
              primary: '#00213F',
              secondary: '#733232',
            },
          },
        },
      },
    },
    {
      title: 'Hej #firstName!',
      description: 'Först börjar vi med att bekräfta dina uppgifter. Stämmer det här?',
      group: 'Ekonomiskt Bistånd',
      image: '',
      icon: ICON_BREIF,
      actions: [
        {
          type: 'next',
          label: 'Ja, allt stämmer',
        },
      ],
      fields: [
        {
          id: 'testField',
          label: 'Test fält',
          placeholder: 'Skriv någonting',
          type: 'text',
        },
      ],
      theme: {
        step: {
          bg: '#FFAA9B',
          banner: {},
          footer: {},
          text: {
            colors: {
              primary: '#00213F',
              secondary: '#733232',
            },
          },
        },
      },
    },
    {
      title: 'Skicka in ditt ärende',
      description: 'Nu är det dags att skicka in ditt ärende',
      group: 'Färdig',
      image: '',
      icon: ICON_BREIF,
      actions: [
        {
          type: 'submit',
          label: 'Skicka ansökan',
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
              primary: '#00213F',
              secondary: '#733232',
            },
          },
        },
      },
    },
  ],
};

export default formEkbMockData;
