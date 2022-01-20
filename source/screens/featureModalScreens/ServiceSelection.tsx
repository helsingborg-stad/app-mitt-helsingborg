import React, { useContext, useMemo } from "react";
import { ActivityIndicator, SafeAreaView, ScrollView } from "react-native";
import styled from "styled-components/native";
import BookablesContext from "../../store/BookablesContext";
import { Text } from "../../components/atoms";

import ButtonList from "../../components/organisms/ButtonList";
import { ModalScreen } from "./types";

const ErrorText = styled(Text)`
  margin: 16px;
`;

interface Props {
  onChangeModalScreen: (
    newRoute: ModalScreen,
    params?: Record<string, unknown>
  ) => void;
}

type ButtonItem = {
  variant?: string;
  underline?: boolean;
  buttonText: string;
  icon: string;
  onClick: () => void;
};

const ServiceSelection = ({ onChangeModalScreen }: Props): JSX.Element => {
  const { bookables, isFetchingBookables, bookablesError, contacts } =
    useContext(BookablesContext);

  const buttons = useMemo(() => {
    const buttonList: ButtonItem[] = bookables.map((bookable) => ({
      underline: false,
      variant: "link",
      buttonText: bookable.name,
      icon: "photo-camera",
      onClick: () => onChangeModalScreen(ModalScreen.BookingForm, bookable),
    }));

    if (contacts.length > 0) {
      buttonList.unshift({
        underline: true,
        buttonText: "Mina kontakter",
        icon: "person",
        onClick: () =>
          onChangeModalScreen(ModalScreen.BookingForm, {
            isContactsMode: true,
            contacts,
          }),
      });
    }

    return buttonList;
  }, [bookables, contacts, onChangeModalScreen]);

  let errorText;
  if (bookablesError) {
    errorText = "Ett fel har inträffat. Vänligen försök igen.";
  } else if (buttons.length === 0) {
    errorText = "Inga tjänster är tillgängliga just nu. Vänligen försök igen.";
  }

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={{ backgroundColor: "white" }}
    >
      <SafeAreaView style={{ backgroundColor: "white" }}>
        {isFetchingBookables && (
          <ActivityIndicator
            size="large"
            color="slategray"
            style={{ marginTop: 30 }}
          />
        )}
        {errorText ? (
          <ErrorText type="h5">{errorText}</ErrorText>
        ) : (
          <ButtonList
            buttonList={buttons}
            defaultColorSchema="red"
            defaultVariant={undefined}
          />
        )}
      </SafeAreaView>
    </ScrollView>
  );
};

export default ServiceSelection;
