export default (theme) => {
  const colors = {
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
        backgroundColor: colors.availableBackground,
        borderRadius: 10,
        width: "90%",
      },
      text: {
        color: colors.availableText,
      },
    },
    selectedStyle: {
      container: {
        backgroundColor: colors.selectedBackground,
        borderRadius: 10,
        width: "90%",
      },
      text: {
        color: colors.selectedText,
      },
    },
    todayStyle: {
      container: {
        width: "90%",
        borderWidth: 2,
        borderColor: colors.todayBorder,
        borderRadius: 10,
      },
      text: {
        color: colors.todayText,
        left: -1,
        top: -1,
      },
    },
  };

  const calendarTheme = {
    arrowColor: "black",
    textDayFontWeight: "600",
    textDisabledColor: colors.disabledText,
    textSectionTitleColor: colors.disabledText,
  };

  return { dayStyles, calendarTheme };
};
