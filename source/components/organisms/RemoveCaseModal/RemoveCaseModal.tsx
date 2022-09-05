import React, { useState } from "react";

import { CloseDialog } from "../../molecules";

import { RemoveCaseState } from "./RemoveCaseModal.types";

import type { ButtonSet, ModalContent, Props } from "./RemoveCaseModal.types";
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

function RemoveCaseModal({
  visible,
  onCloseModal,
  onRemoveCase,
}: Props): JSX.Element | null {
  const [state, setState] = useState(RemoveCaseState.Default);

  const handleRemoveCase = async () => {
    setState(RemoveCaseState.Loading);

    try {
      await onRemoveCase();
    } catch {
      setState(RemoveCaseState.Error);
    }
  };

  const handleCloseModal = () => {
    setState(RemoveCaseState.Default);
    onCloseModal();
  };

  const modalContent: Record<RemoveCaseState, ModalContent> = {
    [RemoveCaseState.Default]: {
      text: {
        title: "Vill du ta bort din ansökan?",
        body: "När en ansökan tagits bort kan en ny ansökan för perioden skapas",
      },
      buttons: [
        getModalButtonSet("Avbryt", "neutral", handleCloseModal),
        getModalButtonSet("Ja", "red", handleRemoveCase),
      ],
    },
    [RemoveCaseState.Loading]: {
      text: {
        title: "Ditt ärende tas bort",
        body: "Vänligen vänta ...",
      },
      buttons: [],
    },
    [RemoveCaseState.Error]: {
      text: {
        title: "Ett fel har inträffat",
        body: "Försök igen eller prova vid ett annat tillfälle om problemet uppstår",
      },
      buttons: [
        getModalButtonSet("Avbryt", "neutral", handleCloseModal),
        getModalButtonSet("Försök igen", "red", handleRemoveCase),
      ],
    },
  };

  if (!visible) return null;

  return (
    <CloseDialog
      visible={visible}
      title={modalContent[state].text.title}
      body={modalContent[state].text.body}
      buttons={modalContent[state].buttons}
    />
  );
}

export default RemoveCaseModal;
