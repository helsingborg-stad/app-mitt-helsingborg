import React, { useContext } from "react";
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
  const {
    bookables,
    isFetchingBookables,
    bookablesError,
    contacts,
    isFetchingContacts,
    contactsError,
  } = useContext(BookablesContext);

  const buttons: ButtonItem[] = bookables.map((bookable) => ({
    underline: false,
    variant: "link",
    buttonText: bookable.name,
    icon: "photo-camera",
    onClick: () => onChangeModalScreen(ModalScreen.BookingForm, bookable),
  }));

  if (!isFetchingContacts && !contactsError && contacts.length > 0) {
    buttons.unshift({
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
        {bookablesError && (
          <ErrorText type="h5">
            Ett fel har inträffat. Vänligen försök igen.
          </ErrorText>
        )}
        {!bookablesError &&
          !isFetchingBookables &&
          (buttons.length === 0 ? (
            <ErrorText type="h5">
              Inga tjänster är tillgängliga just nu. Vänligen försök igen.
            </ErrorText>
          ) : (
            <ButtonList
              buttonList={buttons}
              defaultColorSchema="red"
              defaultVariant={undefined}
            />
          ))}
      </SafeAreaView>
    </ScrollView>
  );
};

export default ServiceSelection;
