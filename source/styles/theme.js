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
        lineHeight: lineHeights[3],
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
    small: {
      width: 18,
      height: 18,
      padding: 0.5,
      margin: 4,
      borderWidth: 2,
      borderRadius: 3,
      icon: 18,
    },
    medium: {
      width: 35,
      height: 35,
      padding: 0.5,
      margin: 4,
      borderWidth: 2,
      borderRadius: 7,
      icon: 36,
    },
    large: {
      width: 52,
      height: 52,
      padding: 0,
      margin: 4,
      borderWidth: 3.2,
      borderRadius: 10,
      icon: 50,
    },
  },
  radiobutton: {
    small: {
      touchable: {
        height: 22,
        width: 22,
        borderRadius: 11,
      },
      border: {
        height: 24,
        width: 24,
        borderRadius: 12,
        borderWidth: 2,
      },
      fill: {
        height: 16,
        width: 16,
        borderRadius: 8,
        margin: 2,
      },
    },
    medium: {
      touchable: {
        height: 36,
        width: 36,
        borderRadius: 18,
      },
      border: {
        height: 36,
        width: 36,
        borderRadius: 18,
        borderWidth: 3,
      },
      fill: {
        height: 25,
        width: 25,
        borderRadius: 12.5,
        margin: 4,
      },
    },
    large: {
      touchable: {
        height: 48,
        width: 48,
        borderRadius: 24,
      },
      border: {
        height: 48,
        width: 48,
        borderRadius: 24,
        borderWidth: 4,
      },
      fill: {
        height: 35,
        width: 35,
        borderRadius: 17.5,
        margin: 6,
      },
    },
  },
  radiobuttonGroup: {
    small: {
      textType: 'text',
      textMargin: 4,
    },
    medium: {
      textType: 'h6',
      textMargin: 15,
    },
    large: {
      textType: 'h5',
      textMargin: 30,
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
  label: {
    small: {
      font: '12px',
      paddingBottom: '3px',
      lineWidth: '2px',
      marginBottom: '6px',
    },
    medium: {
      font: '14px',
      paddingBottom: '7px',
      lineWidth: '3px',
      marginBottom: '12px',
    },
    large: {
      font: '18px',
      paddingBottom: '10px',
      lineWidth: '4px',
      marginBottom: '18px',
    },
    colors: {
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
      darkBlue: {
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
  fieldset: {
    blue: {
      legend: colorPalette.primary.blue[0],
      legendBorder: colorPalette.complementary.blue[1],
      background: colorPalette.complementary.blue[3],
      backgroundEmpty: colorPalette.complementary.blue[3],
    },
    green: {
      legend: colorPalette.primary.green[0],
      legendBorder: colorPalette.complementary.green[1],
      background: colorPalette.complementary.green[3],
      backgroundEmpty: colorPalette.complementary.green[3],
    },
    red: {
      legend: colorPalette.primary.red[0],
      legendBorder: colorPalette.complementary.red[1],
      background: colorPalette.complementary.red[3],
      backgroundEmpty: colorPalette.complementary.red[3],
    },
    purple: {
      legend: colorPalette.primary.purple[0],
      legendBorder: colorPalette.complementary.purple[1],
      background: colorPalette.complementary.purple[3],
      backgroundEmpty: colorPalette.complementary.purple[3],
    },
    darkBlue: {
      legend: colorPalette.neutrals[7],
      legendBorder: 'rgba(0, 33, 63, 0.24)',
      background: 'rgba(0, 33, 63, 0.72)',
      backgroundEmpty: 'rgba(0, 33, 63, 0.24)',
    },
  },
  repeater: {
    blue: {
      inputBackground: colorPalette.complementary.blue[2],
      deleteButton: '#DD6161',
      inputText: colorPalette.neutrals[1],
    },
    green: {
      inputBackground: colorPalette.complementary.green[2],
      deleteButton: '#DD6161',
      inputText: colorPalette.neutrals[1],
    },
    red: {
      inputBackground: colorPalette.complementary.red[2],
      deleteButton: '#DD6161',
      inputText: colorPalette.neutrals[1],
    },
    purple: {
      inputBackground: colorPalette.complementary.purple[2],
      deleteButton: '#DD6161',
      inputText: colorPalette.neutrals[1],
    },
    darkBlue: {
      inputBackground: '#28435B',
      deleteButton: '#DD6161',
      inputText: '#FFFFFF',
    },
  },
  textInput: {
    errorTextColor: '#DD6161',
  },
};

/**
 * Helper function that checks if the passed colorSchema exists on the theme, and if so returns it.
 * Otherwise defaults to the blue colorSchema.
 * @param {string} colorSchema The schema to check
 * @param {string} variant The type of colors we want to check (complementary, primary, etc)
 */
export const getValidColorSchema = (colorSchema, variant = 'primary') =>
  Object.keys(theme.colors[variant]).includes(colorSchema) ? colorSchema : 'blue';

export default theme;
