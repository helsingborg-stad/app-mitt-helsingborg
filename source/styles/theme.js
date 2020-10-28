// theming for styled components goes in this file.
import { colorPalette, deprecatedPalette } from './palette';

const calculateSizeScale = (size, scale) => scale * size;

const setTypography = () => {
  const defaultSize = 12;

  const fontSizes = [0.75, 0.87, 1, 1.25, 1.5, 1.75, 2, 2.25, 2.5, 2.75, 3].map(scale =>
    calculateSizeScale(defaultSize, scale)
  );

  const lineHeights = [1, 1.25, 1.5, 1.75, 2, 2.25, 2.5, 2.75, 3].map(scale =>
    calculateSizeScale(defaultSize, scale)
  );

  const fontWeights = [400, 700];
  return {
    fontFamily: '"Roboto", "Arial", sans-serif"',
    fontSizes,
    lineHeights,
    fontWeights,
    typography: {
      h1: {
        fontWeight: fontWeights[1],
        fontSize: fontSizes[7],
        lineHeight: lineHeights[7],
      },
      h2: {
        fontWeight: fontWeights[1],
        fontSize: fontSizes[5],
        lineHeight: lineHeights[6],
      },
      h3: {
        fontWeight: fontWeights[1],
        fontSize: fontSizes[6],
        lineHeight: lineHeights[7],
      },
      h4: {
        fontWeight: fontWeights[1],
        fontSize: fontSizes[5],
        lineHeight: lineHeights[1],
      },
      h5: {
        fontWeight: fontWeights[1],
        fontSize: fontSizes[4],
        lineHeight: lineHeights[1],
      },
      h6: {
        fontWeight: fontWeights[1],
        fontSize: fontSizes[3],
        lineHeight: lineHeights[1],
      },
      text: {
        fontWeight: fontWeights[0],
        fontSize: fontSizes[2],
        lineHeight: lineHeights[3],
      },
      a: {
        fontWeight: fontWeights[1],
        fontSize: fontSizes[2],
        lineHeight: lineHeights[0],
      },
    },
  };
};

const setLayout = () => {
  const sizeScale = [12, 14, 18, 20, 24, 30, 36, 40];
  return {
    sizes: sizeScale,
  };
};

const transitions = ['all 200ms cubic-bezier(0.4, 0, 0.2, 1)'];

const borders = {
  radii: [0, '0.5rem', '1rem'],
  borders: [0, '1px solid', '2px solid', '4px solid', '8px solid', '16px solid', '32px solid'],
};

const shadows = [
  '0px 1px 3px rgba(0, 0, 0, 0.12), 0px 1px 2px rgba(0, 0, 0, 0.24)',
  '0px 3px 6px rgba(0, 0, 0, 0.15), 0px 2px 4px rgba(0, 0, 0, 0.12)',
  '0px 10px 20px rgba(0, 0, 0, 0.15), 0px 3px 6px rgba(0, 0, 0, 0.10)',
  '0px 15px 25px rgba(0, 0, 0, 0.15), 0px 5px 10px rgba(0, 0, 0, 0.05)',
  '0px 20px 40px rgba(0, 0, 0, 0.2)',
];

const colors = { ...colorPalette };

const baseTheme = {
  ...setTypography(),
  ...setLayout(),
  ...borders,
  colors,
  shadows,
  transitions,
};

const theme = {
  ...baseTheme,
  step: {
    description: {
      heading: {
        ...baseTheme.typography.h2,
        color: baseTheme.colors.neutrals[0],
      },
      text: {
        ...baseTheme.typography.text,
        color: baseTheme.colors.neutrals[0],
      },
      tagline: {
        ...baseTheme.typography.p,
        color: baseTheme.colors.neutrals[4],
      },
    },
    colors: {
      body: {
        bg: baseTheme.colors.neutrals[7],
      },
      footer: {
        bg: baseTheme.colors.neutrals[6],
      },
    },
  },
  // DEPRECATED THEME SETTINGS
  // TODO: Replace deprecated color palette with new color palette
  // TODO: Replace old theme structure with a more solid one.
  title: deprecatedPalette.black,
  anchor: deprecatedPalette.green.dark,
  login: {
    background: deprecatedPalette.bg.default,
  },
  background: {
    default: deprecatedPalette.mono.lightest,
    ...deprecatedPalette.mono,
  },
  border: {
    default: deprecatedPalette.mono.lighter,
    ...deprecatedPalette.mono,
  },
  text: {
    default: deprecatedPalette.mono.darker,
    heading: deprecatedPalette.mono.darkest,
    ...deprecatedPalette.mono,
    purple: {
      ...deprecatedPalette.purple,
    },
    blue: {
      ...deprecatedPalette.blue,
    },
  },
  icon: {
    default: deprecatedPalette.mono.black,
    ...deprecatedPalette.mono,
    purple: {
      ...deprecatedPalette.purple,
    },
    blue: {
      ...deprecatedPalette.blue,
    },
    red: {
      ...deprecatedPalette.red,
    },
    green: {
      ...deprecatedPalette.green,
    },
  },
  button: {
    purple: {
      background: deprecatedPalette.purple[2],
      text: deprecatedPalette.mono.white,
      icon: deprecatedPalette.mono.white,
      iconRight: deprecatedPalette.mono.white,
      shadow: deprecatedPalette.purple[2],
    },
    purpleLight: {
      background: deprecatedPalette.purple[1],
      text: deprecatedPalette.mono.white,
      icon: deprecatedPalette.mono.white,
      iconRight: deprecatedPalette.mono.white,
      shadow: deprecatedPalette.purple[1],
    },
    blue: {
      background: deprecatedPalette.blue[6],
      text: deprecatedPalette.mono.white,
      icon: deprecatedPalette.red[6],
      iconRight: deprecatedPalette.red[6],
      shadow: deprecatedPalette.blue[6],
    },
    white: {
      background: deprecatedPalette.mono.white,
      text: deprecatedPalette.mono.darker,
      icon: deprecatedPalette.purple[1],
      iconRight: deprecatedPalette.mono.light,
      shadow: 'rgba(255, 255, 255, 0.0)',
    },
    light: {
      background: deprecatedPalette.mono.lightest,
      text: deprecatedPalette.mono.darker,
      icon: deprecatedPalette.purple[1],
      iconRight: deprecatedPalette.mono.light,
      shadow: 'rgba(255, 255, 255, 0.0)',
    },
    gray: {
      background: deprecatedPalette.mono.lighter,
      text: deprecatedPalette.mono.darker,
      icon: deprecatedPalette.mono.light,
      iconRight: deprecatedPalette.mono.light,
      shadow: 'rgba(255, 255, 255, 0.0)',
    },
    dark: {
      background: deprecatedPalette.mono.darkest,
      text: deprecatedPalette.mono.lightest,
      icon: deprecatedPalette.mono.light,
      iconRight: deprecatedPalette.mono.light,
      shadow: 'rgba(255, 255, 255, 0.0)',
    },
    swipe: {
      background: '#F5F5F5',
      text: deprecatedPalette.mono.darker,
      icon: deprecatedPalette.purple[1],
      iconRight: deprecatedPalette.purple[1],
      shadow: 'rgba(255, 255, 255, 0.0)',
    },
    red: {
      background: deprecatedPalette.red[2],
      text: deprecatedPalette.mono.white,
      icon: deprecatedPalette.mono.white,
      iconRight: deprecatedPalette.mono.white,
      shadow: deprecatedPalette.red[2],
    },
    green: {
      background: deprecatedPalette.green[6],
      text: deprecatedPalette.mono.blue,
      icon: deprecatedPalette.mono.blue,
      iconRight: deprecatedPalette.mono.blue,
      shadow: deprecatedPalette.green[6],
    },
    orange: {
      background: deprecatedPalette.red[6],
      text: deprecatedPalette.mono.blue,
      icon: deprecatedPalette.mono.blue,
      iconRight: deprecatedPalette.mono.blue,
      shadow: deprecatedPalette.red[6],
    },
    coral: {
      background: deprecatedPalette.red[7],
      text: deprecatedPalette.red[8],
      icon: deprecatedPalette.red[9],
      iconRight: deprecatedPalette.red[9],
      shadow: deprecatedPalette.red[7],
    },
    areo: {
      background: deprecatedPalette.green[7],
      text: deprecatedPalette.green[8],
      icon: deprecatedPalette.green[9],
      iconRight: deprecatedPalette.green[9],
      shadow: deprecatedPalette.green[7],
    },
    floral: {
      background: '#FBF7F0',
      text: deprecatedPalette.blue[6],
      icon: deprecatedPalette.red[9],
      iconRight: deprecatedPalette.red[9],
      shadow: '#FBF7F0',
    },
  },
  checkbox: {
    white: {
      background: deprecatedPalette.mono.white,
      icon: deprecatedPalette.mono.black,
      border: deprecatedPalette.mono.black,
      touch: deprecatedPalette.mono.gray,
      disabled: deprecatedPalette.mono.gray,
      shadow: 'rgba(255, 255, 255, 0.0)',
      checkedBackground: deprecatedPalette.mono.lighter,
    },
    green: {
      background: deprecatedPalette.mono.white,
      icon: deprecatedPalette.green[2],
      border: deprecatedPalette.mono.black,
      touch: deprecatedPalette.green[4],
      disabled: deprecatedPalette.mono.gray,
      shadow: 'rgba(255, 255, 255, 0.0)',
      checkedBackground: deprecatedPalette.mono.lighter,
    },
    light: {
      background: deprecatedPalette.mono.lighter,
      icon: deprecatedPalette.purple[1],
      border: deprecatedPalette.mono.black,
      touch: deprecatedPalette.mono.gray,
      disabled: deprecatedPalette.mono.gray,
      shadow: 'rgba(255, 255, 255, 0.0)',
      checkedBackground: deprecatedPalette.mono.lighter,
    },
    gray: {
      background: deprecatedPalette.mono.gray,
      icon: deprecatedPalette.red[3],
      border: deprecatedPalette.mono.black,
      touch: deprecatedPalette.mono.lighter,
      disabled: deprecatedPalette.mono.lighter,
      shadow: 'rgba(255, 255, 255, 0.0)',
      checkedBackground: deprecatedPalette.mono.lighter,
    },
    dark: {
      background: deprecatedPalette.mono.darkest,
      icon: deprecatedPalette.mono.white,
      border: deprecatedPalette.mono.lighter,
      touch: deprecatedPalette.mono.gray,
      disabled: deprecatedPalette.mono.gray,
      shadow: 'rgba(255, 255, 255, 0.0)',
      checkedBackground: deprecatedPalette.mono.white,
    },
    blue: {
      background: deprecatedPalette.blue[4],
      icon: deprecatedPalette.mono.white,
      border: deprecatedPalette.mono.lighter,
      touch: deprecatedPalette.mono.gray,
      disabled: deprecatedPalette.mono.gray,
      shadow: 'rgba(255, 255, 255, 0.0)',
      checkedBackground: deprecatedPalette.blue[6],
    },
    lightGreen: {
      background: deprecatedPalette.green[6],
      icon: deprecatedPalette.blue[6],
      border: deprecatedPalette.mono.lighter,
      touch: deprecatedPalette.mono.gray,
      disabled: deprecatedPalette.mono.gray,
      shadow: 'rgba(255, 255, 255, 0.0)',
      checkedBackground: deprecatedPalette.green[6],
    },
    red: {
      background: deprecatedPalette.red[6],
      icon: deprecatedPalette.blue[6],
      border: deprecatedPalette.mono.lighter,
      touch: deprecatedPalette.mono.gray,
      disabled: deprecatedPalette.mono.gray,
      shadow: 'rgba(255, 255, 255, 0.0)',
      checkedBackground: deprecatedPalette.red[6],
    },
  },
  list: {
    onLightBackground: {
      listWithAvatar: {
        headerColor: 'rgba(0, 0, 0, 0.64)',
        headerSeparatorBackground: 'rgba(0, 0, 0, 0.48)',
        text: deprecatedPalette.mono.blue,
        bodyTextColor: '#855851',
        headerBorderHeight: '2px',
      },
    },
  },
  status: {},
  chatBubble: {
    user: {
      // "User"
      background: deprecatedPalette.purple[3],
      text: deprecatedPalette.mono.white,
      asideIcon: deprecatedPalette.mono.white,
    },
    human: {
      // "Sally"
      background: deprecatedPalette.mono.white,
      text: deprecatedPalette.mono.gray,
      asideIcon: deprecatedPalette.mono.darkest,
    },
    automated: {
      // "KC"
      background: deprecatedPalette.mono.white,
      text: deprecatedPalette.mono.gray,
      asideIcon: deprecatedPalette.mono.darkest,
    },
  },
  chatBody: {
    background: deprecatedPalette.bg.default,
  },
  chatForm: {
    background: deprecatedPalette.bg.header,
  },
  shadow: {
    default: deprecatedPalette.mono.darker,
  },
  divider: {
    title: deprecatedPalette.mono.lighter,
    info: deprecatedPalette.mono.gray,
  },
  picker: {
    background: deprecatedPalette.mono.lighter,
    accessory: {
      background: deprecatedPalette.mono.lighter,
      border: deprecatedPalette.mono.lightest,
    },
  },
  heading: {
    default: deprecatedPalette.mono.darker,
    heading: deprecatedPalette.mono.darkest,
    ...deprecatedPalette.mono,
    purple: {
      ...deprecatedPalette.purple,
    },
    blue: {
      ...deprecatedPalette.blue,
    },
    red: {
      ...deprecatedPalette.red,
    },
    green: {
      ...deprecatedPalette.green,
    },
  },
  fieldLabel: {
    purple: {
      text: deprecatedPalette.mono.white,
      underline: deprecatedPalette.purple[2],
    },
    purpleLight: {
      text: deprecatedPalette.mono.white,
      underline: deprecatedPalette.purple[1],
    },
    blue: {
      text: deprecatedPalette.mono.white,
      underline: deprecatedPalette.blue[6],
    },
    white: {
      text: deprecatedPalette.mono.darker,
      underline: 'rgba(255, 255, 255, 0.0)',
    },
    light: {
      text: deprecatedPalette.mono.darker,
      underline: deprecatedPalette.mono.light,
    },
    gray: {
      text: deprecatedPalette.mono.darker,
      underline: deprecatedPalette.mono.gray,
    },
    dark: {
      text: deprecatedPalette.mono.lightest,
      underline: deprecatedPalette.mono.light,
    },
    swipe: {
      text: deprecatedPalette.mono.darker,
      underline: 'rgba(255, 255, 255, 0.0)',
    },
    red: {
      text: deprecatedPalette.red[5],
      underline: deprecatedPalette.red[2],
    },
    green: {
      text: deprecatedPalette.mono.darker,
      underline: deprecatedPalette.green[6],
    },
    orange: {
      text: deprecatedPalette.mono.blue,
      underline: deprecatedPalette.red[6],
    },
  },
  input: {
    light: {
      text: deprecatedPalette.mono.black,
      background: deprecatedPalette.mono.white,
      border: deprecatedPalette.mono.light,
      placeholder: deprecatedPalette.mono.darker,
    },
    dark: {
      text: deprecatedPalette.mono.white,
      background: deprecatedPalette.blue[6],
      border: deprecatedPalette.blue[6],
      placeholder: deprecatedPalette.mono.light,
    },
    red: {
      text: deprecatedPalette.mono.black,
      background: deprecatedPalette.red[6],
      border: deprecatedPalette.red[4],
      placeholder: deprecatedPalette.mono.darker,
    },
    green: {
      text: deprecatedPalette.mono.black,
      background: deprecatedPalette.green[6],
      border: deprecatedPalette.green[5],
      placeholder: deprecatedPalette.mono.darker,
    },
  },
  checkboxField: {
    light: {
      text: deprecatedPalette.mono.black,
    },
    gray: {
      text: deprecatedPalette.mono.gray,
    },
    dark: {
      text: deprecatedPalette.mono.white,
    },
    blue: {
      text: deprecatedPalette.mono.lightest,
    },
    red: {
      text: deprecatedPalette.mono.darkest,
    },
    green: {
      text: deprecatedPalette.mono.darkest,
    },
  },
  formField: {
    light: {},
    dark: {},
    red: {},
    green: {},
    blue: {},
  },
  groupedList: {
    red: {
      headerBackground: deprecatedPalette.red[7],
      headerText: deprecatedPalette.red[8],
      bodyBackground: deprecatedPalette.mono.floral,
      bodyText: deprecatedPalette.mono.black,
    },
    light: {
      headerBackground: deprecatedPalette.mono.light,
      headerText: deprecatedPalette.mono.black,
      bodyBackground: deprecatedPalette.mono.lighter,
      bodyText: deprecatedPalette.mono.black,
    },
    orange: {
      headerBackground: deprecatedPalette.red[6],
      headerText: deprecatedPalette.red[8],
      bodyBackground: deprecatedPalette.red[7],
      bodyText: deprecatedPalette.mono.black,
    },
    green: {
      headerBackground: deprecatedPalette.green[7],
      headerText: deprecatedPalette.green[8],
      bodyBackground: deprecatedPalette.mono.floral,
      bodyText: deprecatedPalette.mono.black,
    },
  },
};

export default theme;
