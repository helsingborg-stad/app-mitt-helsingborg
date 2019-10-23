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
  anchor: palette.green.dark,
  input: {
    background: palette.mono.white,
    border: palette.mono.lighter
  },
  background: {
    default: palette.mono.lightest,
    ...palette.mono
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
      ...palette.purple
    },
    blue: {
      ...palette.blue
    }
  },
  icon: {
    default: palette.mono.black,
    ...palette.mono,
    purple: {
      ...palette.purple
    },
    blue: {
      ...palette.blue
    },
    red: {
      ...palette.red
    },
    green: {
      ...palette.green
    }
  },
  button: {
    purple: {
      background: palette.purple[2],
      text: palette.mono.white,
      icon: palette.mono.white,
      iconRight: palette.mono.white,
      shadow: palette.purple[2],
    },
    blue: {
      background: palette.blue[2],
      text: palette.mono.white,
      icon: palette.mono.white,
      iconRight: palette.mono.white,
      shadow: palette.blue[2],
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
  },
  status: {
  },
  chatBubble: {
    user: { // "User"
      background: palette.purple[3],
      text: palette.mono.white,
    },
    human: { // "Sally"
      background: palette.mono.white,
      text: palette.mono.gray,
    },
    automated: { // "KC"
      background: palette.mono.white,
      text: palette.mono.gray,
    }
  },
  chatBody: {
      background: palette.mono.lightest
  },
  chatForm: {
      background: palette.mono.lightest
  },
  shadow: {
    default: palette.mono.darker
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
    }
  },
  heading: {
      default: palette.mono.darker,
      heading: palette.mono.darkest,
      ...palette.mono,
      purple: {
          ...palette.purple
        },
        blue: {
          ...palette.blue
        }
   }
};

export default colors;
