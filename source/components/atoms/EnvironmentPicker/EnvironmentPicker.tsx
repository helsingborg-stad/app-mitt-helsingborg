import * as React from "react";
import { View } from "react-native";
import type { Item } from "react-native-picker-select";
import RNPickerSelect from "react-native-picker-select";
import useEnvironmentService from "../../../hooks/useEnvironmentService";
import type { EnvironmentConfig } from "../../../services/environment/environmentService.types";
import { pickerStyles } from "./EnvironmentPicker.styled";

export default function EnvironmentPicker(): JSX.Element {
  const { environments, activeEnvironment, setActive } =
    useEnvironmentService();

  const items = Object.entries(environments).map<Item>(([label, value]) => ({
    label,
    value,
  }));

  const onChange = (value: EnvironmentConfig) => {
    setActive(value.name);
  };

  return (
    <View>
      {items.length > 1 ? (
        <RNPickerSelect
          onValueChange={onChange}
          placeholder={{}}
          items={items}
          itemKey={activeEnvironment.url}
          style={pickerStyles}
        />
      ) : null}
    </View>
  );
}
