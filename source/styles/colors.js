const palette = {
    black: "#1D1D1D",
    white: "#FFF",
    grey: {
      light: "#C8D1D4",
      origin: "#808080",
      dark: "#373F47"
    },
    blue: {
      light: "#A6E6FC",
      origin: "#13A3D3",
      dark: "#165B72"
    },
    green: {
      light: "#F4FFFD",
      origin: "#96D7CE",
      dark: "#009a6b"
    },
    orange: {
      light: "#fcd0a4",
      origin: "#faaa5a",
      dark: "#f88410"
    },
    red: {
      light: "#f79686",
      origin: "#f2583e",
      dark: "#f03819"
    },
    purple: {
      light: "#8a73d9",
      origin: "#5737c9",
      dark: "#3d268d"
    },
    lightWhite: "#F4F5F7",
    pink: {
      light: "#E8BACA",
      origin: "#D496A7"
    },
    yellow: {
      light: "#F9F9BB",
      origin: "#FFEE93"
    }
};
  
const colors = {
    title: palette.black,
    text: palette.purple.dark,
    anchor: palette.green.dark,
    input: {
      normal: palette.blue.light,
      focus: palette.blue.origin,
      invalid: palette.red.origin,
      disabled: palette.grey.light
    },
    base: {
      primary: palette.green.origin,
      secondary: palette.green.origin,
      accent: palette.orange.origin,
      grey: palette.grey.light,
    },
    button: {
      primary: palette.green.origin,
      secondary: palette.blue.origin,
      accent: palette.orange.origin,
      disabled: palette.grey.light,
      danger: palette.red.origin
    },
    status: {
      neutral: palette.grey.dark,
      warning: palette.orange.origin,
      error: palette.red.origin,
      success: palette.green.origin
    }
};

export default colors;