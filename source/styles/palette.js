/**
 * Primary colors appear the most in the UI, and are the ones that determine the overall
 * "look" of the application. These are used for things like primary actions, links, navigation items,
 * icons, accent borders, or text that we empahsize.
 */

const primary = {
  blue: ['#003359', '#005C86', '#1C73A6', '#4989B6'],
  green: ['#205400', '#50811B', '#6F9725', '#80B14A'],
  red: ['#770000', '#AE0B05', '#B23700', '#E84C31'],
  purple: ['#4B0034', '#7B075E', '#9E166A', '#AD428B'],
};

/**
 * Complemetary colors should be used fairly conservativley thorughout our UI to avoid overpowering our
 * primary colors. Use them when you need an element to stand out, or reinforce things like error
 * states or positive trends.
 */

const complementary = {
  blue: ['#C2CED7', '#DBE4E9', '#E4EBF0', '#EEF3F6'],
  green: ['#C9D6C2', '#E1E9DB', '#EAF0E4', '#F2F6EE'],
  red: ['#DEC2C2', '#F0DBD9', '#F5E4E3', '#FAEEEC'],
  purple: ['#D4C2CE', '#E8DAE4', '#EFE4EB', '#F6EDF3'],
};

/**
 * Neutral colors are used the most and makes up the majority of the UI.
 * They are used for most of the texts, backgrounds, and borders, as well as for things like
 * secondary buttons and links
 */
const neutrals = [
  '#000000',
  '#3D3D3D',
  '#565656',
  '#707070',
  '#A3A3A3',
  '#F5F5F5',
  '#FCFCFC',
  '#FFFFFF',
];

/**
 * The color palette that includes all our different color categories
 * (primary, neutrals, supporting etc)
 */

export const colorPalette = {
  primary,
  complementary,
  neutrals,
};

// THIS COLOR PALETTE IS DEPRECATED.
// TODO: REPLACE WHEN NEW COLOR PALETTE IS SET.
export const deprecatedPalette = {
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
    floral: '#FBF7F0',
  },
  red: {
    1: '#F7A600',
    2: '#CB0050',
    3: '#EC6701',
    4: '#AE0B05',
    5: '#E3000F',
    6: '#FFAA9B',
    7: '#F5D2C8',
    8: '#5C3D38',
    9: '#DD6161',
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
    7: '#1F3C56',
  },
  green: {
    1: '#AFCA05',
    2: '#11A636',
    3: '#A0C855',
    4: '#50811B',
    5: '#76B828',
    6: '#75C9A8',
    7: '#BFDECD',
    8: '#2A483C',
    9: '#3DA68C',
  },
  state: {
    danger: '#D73640',
  },
  bg: {
    default: '#F5F5F5',
    header: '#F8F8F8',
  },
};
