export default (theme) => {
  const color = {
    selectedBackground: theme.colors.primary.red[0],
    selectedText: theme.colors.neutrals[7],
    availableBackground: theme.colors.complementary.red[2],
    availableText: theme.colors.primary.red[0],
    todayBorder: theme.colors.primary.red[3],
    todayText: theme.colors.primary.green[0],
    disabledText: theme.colors.neutrals[4],
  };

  const dayStyles = {
    availableStyle: {
      container: {
        backgroundColor: color.availableBackground,
        borderRadius: 10,
        width: "90%",
      },
      text: {
        color: color.availableText,
      },
    },
    selectedStyle: {
      container: {
        backgroundColor: color.selectedBackground,
        borderRadius: 10,
        width: "90%",
      },
      text: {
        color: color.selectedText,
      },
    },
    todayStyle: {
      container: {
        width: "90%",
        borderWidth: 2,
        borderColor: color.todayBorder,
        borderRadius: 10,
      },
      text: {
        color: color.todayText,
        left: -1,
        top: -1,
      },
    },
  };

  const calendarTheme = {
    arrowColor: "black",
    textDayFontWeight: "600",
    textDisabledColor: color.disabledText,
    textSectionTitleColor: color.disabledText,
  };

  return { dayStyles, calendarTheme };
};
