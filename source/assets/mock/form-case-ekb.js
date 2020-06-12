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
          fieldType: 'address',
          title: 'Boende/Tillgånger',
          inputs: [
            {
              key: 'key-1',
              label: 'Adress',
              type: 'text',
              value: 'Storgatan 9, Helsingborg',
            },
            {
              key: 'key-2',
              label: 'Storlek',
              type: 'text',
              value: '1 rum & kök',
            },
            {
              key: 'key-3',
              label: 'Hyresvärd',
              type: 'text',
              value: 'Helsingborgshem',
            },
          ],
        },
        {
          fieldType: 'personal',
          title: 'Mina Uppgifter',
          inputs: [
            {
              key: 'key-1',
              label: 'Epost',
              type: 'text',
              value: 'karin.olsson@epost.com',
            },
            {
              key: 'key-2',
              label: 'Telefone',
              type: 'text',
              value: '760000009',
            },
            {
              key: 'key-3',
              label: 'Medborgarskap',
              type: 'text',
              value: 'Svenskt',
            },
            {
              key: 'key-4',
              label: 'Sysselsättning',
              type: 'text',
              value: 'Arbetssökande',
            },
          ],
        },
      ],
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
