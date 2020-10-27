/**
 * Primary colors appear the most in the UI, and are the ones that determine the overall
 * "look" of the application. These are used for things like primary actions, links, navigation items,
 * icons, accent borders, or text that we empahsize.
 */

const primary = [
  '#4D6A66',
  '#336868',
  '#668B87',
  '#7FAEA9',
  '#98D1CB',
  '#B4DAD7',
  '#CFE6E4',
  '#E9F3F2',
];

const secondary = ['#755F67', '#9C7E89', '#C39EAB', '#EABDCD', '#EECFDA', '#F3E1E7', '#F9F1F4'];

/**
 * Neutrals colors are uses the most and makes up the majority of the UI.
 * They are used for most of the texts, backgrounds, and borders, as well as for things like
 * secondary buttons and links
 */
const neutrals = [
  '#000000',
  '#3D3D3D',
  '#565656',
  '#707070',
  '#A3A3A3',
  '#E5E5E5',
  '#F5F5F5',
  '#FCFCFC',
  '#FFFFFF',
];

/**
 * Supporting colors should be used fairly conservativley thorughout our UI to avoid overpowering our
 * primary colors. Use them when you need an element to stand out, or reinforce things like error
 * states or positive trends witht he appropriate semantic color
 */
const supporting = {
  blue: ['#515C65', '#6B7B87', '#8599A8', '#A0B8CA', '#BACAD6', '#D3DCE3', '#EAEFF2'],
  green: ['#1D5A36', '#267847', '#309458', '#3EAF6A', '#73BF91', '#A4D3B8', '#D5E9DD'],
  red: ['#591C1D', '#772525', '#952F2F', '#B33838', '#C26F6F', '#D4A4A4', '#EAD5D5'],
  yellow: ['#786E38', '#9E9148', '#C6B65B', '#EDDA6D', '#EEE196', '#F2E9BE', '#F7F4E1'],
};

/**
 * The color palette that includes all our different color categories
 * (primary, neutrals, supporting etc)
 */

export const colorPalette = {
  primary,
  secondary,
  neutrals,
  supporting,
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
