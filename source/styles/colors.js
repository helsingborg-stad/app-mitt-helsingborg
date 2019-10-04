const palette = {
  mono: {
    black: "#000000",
    darkest: "#3D3D3D",
    darker: "#565656",
    gray: "#707070",
    light: "#A3A3A3",
    lighter: "#E5E5E5",
    lightest: "#FCFCFC",
    white: "#FFFFFF",
  },
  red: {
    1: "#F7A600",
    2: "#CB0050",
    3: "#EC6701",
    4: "#AE0B05",
    5: "#E3000F",
  },
  purple: {
    1: "#D35098",
    2: "#712082",
    3: "#A84C98",
    4: "#7B075E",
    5: "#A61380",
  },
  blue: {
    1: "#4DB4E7",
    2: "#0069B4",
    3: "#5BA1D8",
    4: "#005C86",
    5: "#0095DB",
  },
  green: {
    1: "#AFCA05",
    2: "#11A636",
    3: "#A0C855",
    4: "#50811B",
    5: "#76B828",
  },
  state: {
    danger: "#D73640"
  }
};

const colors = {
  title: palette.black,
  text: {
    default: palette.mono.black,
    dark: palette.mono.black,
    light: palette.mono.white
  },
  anchor: palette.green.dark,
  input: {
    background: palette.mono.white,
    border: palette.mono.lighter
  },
  base: {
  },
  button: {
    purple: {
      background: palette.purple[2],
      text: palette.mono.white
    },
    blue: {
      background: palette.blue[2],
      text: palette.mono.white
    },
    white: {
      background: palette.mono.white,
      text: palette.mono.darker
    },
  },
  status: {
  }
};

export default colors;