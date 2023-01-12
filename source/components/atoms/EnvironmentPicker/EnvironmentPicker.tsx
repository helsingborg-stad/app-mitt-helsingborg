import * as React from "react";
import { useState, useEffect, useContext } from "react";
import { View } from "react-native";
import type { Item } from "react-native-picker-select";
import RNPickerSelect from "react-native-picker-select";
import type { EnvironmentConfig } from "../../../services/environment/environmentService.types";
import { EnvironmentContext } from "../../../store/EnvironmentContext";
import { pickerStyles } from "./EnvironmentPicker.styled";

export default function EnvironmentPicker(): JSX.Element {
  const { environments, activeEnvironment, setActive } =
    useContext(EnvironmentContext);
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    setItems(
      Object.entries(environments).map<Item>(([label, value]) => ({
        label,
        value,
      }))
    );
  }, [environments]);

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
