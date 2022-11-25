import React from "react";

import { CloseDialog } from "../../molecules";

import type { ButtonSet, Props } from "./SetupFormModal.types";
import type { PrimaryColor } from "../../../theme/themeHelpers";

const getModalButtonSet = (
  text: string,
  color: PrimaryColor,
  clickHandler: () => void | Promise<void>
): ButtonSet => ({
  text,
  color,
  clickHandler,
});

function SetupFormModal({
  visible,
  hasError,
  onCloseModal,
  onRetryOpenForm,
}: Props): JSX.Element | null {
  const defaultContent = {
    text: {
      title: "Förbereder formulär",
      body: "Vänligen vänta ...",
    },
    buttons: [],
  };

  const errorContent = {
    text: {
      title: "Ett fel har uppstått ",
      body: "Vill du försöka igen?",
    },
    buttons: [
      getModalButtonSet("Avbryt", "neutral", onCloseModal),
      getModalButtonSet("Ja", "red", onRetryOpenForm),
    ],
  };

  const { text, buttons } = hasError ? errorContent : defaultContent;

  if (!visible) return null;

  return (
    <CloseDialog
      visible={visible}
      title={text.title}
      body={text.body}
      buttons={buttons}
    />
  );
}

export default SetupFormModal;
