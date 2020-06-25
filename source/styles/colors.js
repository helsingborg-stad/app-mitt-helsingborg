const palette = {
  mono: {
    black: '#000000',
    darkest: '#3D3D3D',
    darker: '#565656',
    gray: '#707070',
    light: '#A3A3A3',
    lighter: '#E5E5E5',
    lightest: '#FCFCFC',
    white: '#FFFFFF',
    blue: '#00213F',
  },
  red: {
    1: '#F7A600',
    2: '#CB0050',
    3: '#EC6701',
    4: '#AE0B05',
    5: '#E3000F',
    6: '#FFAA9B',
  },
  purple: {
    1: '#D35098',
    2: '#712082',
    3: '#A84C98',
    4: '#7B075E',
    5: '#A61380',
  },
  blue: {
    1: '#4DB4E7',
    2: '#0069B4',
    3: '#5BA1D8',
    4: '#005C86',
    5: '#0095DB',
    6: '#00213F',
  },
  green: {
    1: '#AFCA05',
    2: '#11A636',
    3: '#A0C855',
    4: '#50811B',
    5: '#76B828',
    6: '#75C9A8',
  },
  state: {
    danger: '#D73640',
  },
  bg: {
    default: '#F5F5F5',
    header: '#F8F8F8',
  },
};

const colors = {
  title: palette.black,
  anchor: palette.green.dark,
  login: {
    background: palette.bg.default,
  },
  background: {
    default: palette.mono.lightest,
    ...palette.mono,
  },
  border: {
    default: palette.mono.lighter,
    ...palette.mono,
  },
  text: {
    default: palette.mono.darker,
    heading: palette.mono.darkest,
    ...palette.mono,
    purple: {
      ...palette.purple,
    },
    blue: {
      ...palette.blue,
    },
  },
  icon: {
    default: palette.mono.black,
    ...palette.mono,
    purple: {
      ...palette.purple,
    },
    blue: {
      ...palette.blue,
    },
    red: {
      ...palette.red,
    },
    green: {
      ...palette.green,
    },
  },
  button: {
    purple: {
      background: palette.purple[2],
      text: palette.mono.white,
      icon: palette.mono.white,
      iconRight: palette.mono.white,
      shadow: palette.purple[2],
    },
    purpleLight: {
      background: palette.purple[1],
      text: palette.mono.white,
      icon: palette.mono.white,
      iconRight: palette.mono.white,
      shadow: palette.purple[1],
    },
    blue: {
      background: palette.blue[6],
      text: palette.mono.white,
      icon: palette.mono.white,
      iconRight: palette.mono.white,
      shadow: palette.blue[6],
    },
    white: {
      background: palette.mono.white,
      text: palette.mono.darker,
      icon: palette.purple[1],
      iconRight: palette.mono.light,
      shadow: 'rgba(255, 255, 255, 0.0)',
    },
    light: {
      background: palette.mono.lightest,
      text: palette.mono.darker,
      icon: palette.purple[1],
      iconRight: palette.mono.light,
      shadow: 'rgba(255, 255, 255, 0.0)',
    },
    gray: {
      background: palette.mono.lighter,
      text: palette.mono.darker,
      icon: palette.mono.light,
      iconRight: palette.mono.light,
      shadow: 'rgba(255, 255, 255, 0.0)',
    },
    dark: {
      background: palette.mono.darkest,
      text: palette.mono.lightest,
      icon: palette.mono.light,
      iconRight: palette.mono.light,
      shadow: 'rgba(255, 255, 255, 0.0)',
    },
    swipe: {
      background: '#F5F5F5',
      text: palette.mono.darker,
      icon: palette.purple[1],
      iconRight: palette.purple[1],
      shadow: 'rgba(255, 255, 255, 0.0)',
    },
    red: {
      background: palette.red[2],
      text: palette.mono.white,
      icon: palette.mono.white,
      iconRight: palette.mono.white,
      shadow: palette.red[2],
    },
    green: {
      background: palette.green[6],
      text: palette.mono.blue,
      icon: palette.mono.blue,
      iconRight: palette.mono.blue,
      shadow: palette.green[6],
    },
    orange: {
      background: palette.red[6],
      text: palette.mono.blue,
      icon: palette.mono.blue,
      iconRight: palette.mono.blue,
      shadow: palette.red[6],
    },
  },
  checkbox: {
    white: {
      background: palette.mono.white,
      icon: palette.mono.black,
      border: palette.mono.black,
      touch: palette.mono.gray,
      disabled: palette.mono.gray,
      shadow: 'rgba(255, 255, 255, 0.0)',
    },
    light: {
      background: palette.mono.lighter,
      icon: palette.purple[1],
      border: palette.mono.black,
      touch: palette.mono.gray,
      disabled: palette.mono.gray,
      shadow: 'rgba(255, 255, 255, 0.0)',
    },
    gray: {
      background: palette.mono.gray,
      icon: palette.red[3],
      border: palette.mono.black,
      touch: palette.mono.lighter,
      disabled: palette.mono.lighter,
      shadow: 'rgba(255, 255, 255, 0.0)',
    },
    dark: {
      background: palette.mono.darkest,
      icon: palette.mono.white,
      border: palette.mono.lighter,
      touch: palette.mono.gray,
      disabled: palette.mono.gray,
      shadow: 'rgba(255, 255, 255, 0.0)',
    },
  },
  list: {
    onLightBackground: {
      listWithAvatar: {
        headerColor: 'rgba(0, 0, 0, 0.64)',
        headerSeparatorBackground: 'rgba(0, 0, 0, 0.48)',
        text: palette.mono.blue,
        bodyTextColor: '#855851',
        headerBorderHeight: '2px',
      },
    },
  },
  status: {},
  chatBubble: {
    user: {
      // "User"
      background: palette.purple[3],
      text: palette.mono.white,
      asideIcon: palette.mono.white,
    },
    human: {
      // "Sally"
      background: palette.mono.white,
      text: palette.mono.gray,
      asideIcon: palette.mono.darkest,
    },
    automated: {
      // "KC"
      background: palette.mono.white,
      text: palette.mono.gray,
      asideIcon: palette.mono.darkest,
    },
  },
  chatBody: {
    background: palette.bg.default,
  },
  chatForm: {
    background: palette.bg.header,
  },
  shadow: {
    default: palette.mono.darker,
  },
  divider: {
    title: palette.mono.lighter,
    info: palette.mono.gray,
  },
  picker: {
    background: palette.mono.lighter,
    accessory: {
      background: palette.mono.lighter,
      border: palette.mono.lightest,
    },
  },
  heading: {
    default: palette.mono.darker,
    heading: palette.mono.darkest,
    ...palette.mono,
    purple: {
      ...palette.purple,
    },
    blue: {
      ...palette.blue,
    },
    red: {
      ...palette.red,
    },
    green: {
      ...palette.green,
    },
  },
  fieldLabel: {
    purple: {
      text: palette.mono.white,
      underline: palette.purple[2],
    },
    purpleLight: {
      text: palette.mono.white,
      underline: palette.purple[1],
    },
    blue: {
      text: palette.mono.white,
      underline: palette.blue[6],
    },
    white: {
      text: palette.mono.darker,
      underline: 'rgba(255, 255, 255, 0.0)',
    },
    light: {
      text: palette.mono.darker,
      underline: palette.mono.light,
    },
    gray: {
      text: palette.mono.darker,
      underline: palette.mono.gray,
    },
    dark: {
      text: palette.mono.lightest,
      underline: palette.mono.light,
    },
    swipe: {
      text: palette.mono.darker,
      underline: 'rgba(255, 255, 255, 0.0)',
    },
    red: {
      text: palette.red[5],
      underline: palette.red[2],
    },
    green: {
      text: palette.mono.darker,
      underline: palette.green[6],
    },
    orange: {
      text: palette.mono.blue,
      underline: palette.red[6],
    },
  },
  input: {
    light: {
      text: palette.mono.black,
      background: palette.mono.white,
      border: palette.mono.light,
      placeholder: palette.mono.darker,
    },
    dark: {
      text: palette.mono.white,
      background: palette.blue[6],
      border: palette.blue[6],
      placeholder: palette.mono.light,
    },
    red: {
      text: palette.mono.black,
      background: palette.red[6],
      border: palette.red[4],
      placeholder: palette.mono.darker,
    },
    green: {
      text: palette.mono.black,
      background: palette.green[6],
      border: palette.green[5],
      placeholder: palette.mono.darker,
    },
  },
};

export default colors;
