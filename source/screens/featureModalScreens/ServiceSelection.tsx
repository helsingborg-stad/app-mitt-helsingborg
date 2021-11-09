import React, { useMemo } from "react";
import { SafeAreaView, ScrollView } from "react-native";

import ButtonList from "../../components/organisms/ButtonList";

interface Props {
  onNavigate: (newRoute: string, params?: Record<string, unknown>) => void;
}
const ServiceSelection = ({ onNavigate }: Props): JSX.Element => {
  const buttons = useMemo(
    () => [
      {
        buttonText: "Mina kontakter",
        icon: "person",
        onClick: () => onNavigate("App"),
        colorSchema: "red",
        variant: "contained",
      },
      {
        buttonText: "Budget- och skuldrådgivning",
        icon: "photo-camera",
        onClick: () => onNavigate("App"),
      },
      {
        buttonText: "Kostnadsfri och oberoende energi- och klimatrådgivning",
        icon: "photo-camera",
        onClick: () => onNavigate("App"),
      },
      {
        buttonText: "Konsumentrådgivning",
        icon: "photo-camera",
        onClick: () => onNavigate("App"),
      },
      {
        buttonText: "Rådgivare för personer med funktionsnedsättning",
        icon: "photo-camera",
        onClick: () => onNavigate("App"),
      },
      {
        buttonText: "Seniorrådgivning",
        icon: "photo-camera",
        onClick: () => onNavigate("App"),
      },
    ],
    [onNavigate]
  );

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={{ backgroundColor: "white" }}
    >
      <SafeAreaView style={{ backgroundColor: "white" }}>
        <ButtonList
          buttonList={buttons}
          defaultColorSchema="red"
          defaultVariant="link"
        />
      </SafeAreaView>
    </ScrollView>
  );
};

export default ServiceSelection;
