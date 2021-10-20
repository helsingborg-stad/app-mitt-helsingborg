import React, { useMemo } from "react";

import ButtonList from "../../components/organisms/ButtonList";
import { ModalScreen } from "./types";

interface Props {
  onNavigate: (newRoute: string) => void;
  onChangeModalScreen: (screen: ModalScreen) => void;
}
const Features = ({ onNavigate, onChangeModalScreen }: Props): JSX.Element => {
  const buttons = useMemo(
    () => [
      {
        buttonText: "Boka möte",
        icon: "photo-camera",
        onClick: () => onChangeModalScreen(ModalScreen.ServiceSelections),
      },
      {
        buttonText: "Nytt ärende",
        icon: "add-photo-alternate",
        onClick: () => onNavigate("App"),
      },
      {
        buttonText: "Hjälp",
        icon: "help-outline",
        onClick: () => onNavigate("App"),
      },
    ],
    [onNavigate, onChangeModalScreen]
  );

  return (
    <ButtonList
      buttonList={buttons}
      defaultColorSchema="red"
      defaultVariant="link"
    />
  );
};

export default Features;
