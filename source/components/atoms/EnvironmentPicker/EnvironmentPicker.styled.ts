import type { PickerStyle } from "react-native-picker-select";

export const pickerStyles: PickerStyle = {
  inputIOS: {
    fontSize: 12,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 4,
    color: "black",
    paddingRight: 30,
  },
  inputAndroid: {
    color: "black",
    height: 40,
  },
};
