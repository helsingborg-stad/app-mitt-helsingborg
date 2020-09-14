import { StyleSheet } from "react-native";
import colors from "../../../styles/colors";

export const HEIGHT = 60;

export default StyleSheet.create({
  base: {
    position: "absolute",
    zIndex: 8000,
    top: 40,
    left: "15%",
    right: "15%",
    bottom: 0,
    height: 60,
    width: "70%",
    backgroundColor: "white",
    flexDirection: "row",
    borderRadius: 6,
    color: colors.text.white,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  top: {
    top: 0,
  },
  bottom: {
    bottom: 0,
  },
  borderLeft: {
    borderLeftWidth: 5,
    borderLeftColor: colors.border.darker,
  },
  iconContainer: {
    paddingHorizontal: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    width: 20,
    height: 20,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
  },
  closeButtonContainer: {
    paddingHorizontal: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  closeIcon: {
    width: 9,
    height: 9,
  },
  text1: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 3,
  },
  text2: {
    fontSize: 10,
    color: colors.text.darker,
  },
});
