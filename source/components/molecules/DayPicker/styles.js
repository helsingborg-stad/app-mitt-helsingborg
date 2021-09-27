const colors = {
  selectedBackground: "#ae0b05",
  selectedText: "#ffffff",
  availableBackground: "#f5e4e3",
  availableText: "#770000",
  todayBorder: "#e84c31",
  todayText: "#205400",
  disabledText: "#a3a3a3",
};

/* used in `customStyles` field in the `markedDates` prop in <Calendar/> */
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

/* used as `theme` prop in <Calendar/> for styling internal components */
const calendarTheme = {
  arrowColor: "black",
  textDayFontWeight: "600",
  textDisabledColor: colors.disabledText,
  textSectionTitleColor: colors.disabledText,
};

export { dayStyles, calendarTheme };
