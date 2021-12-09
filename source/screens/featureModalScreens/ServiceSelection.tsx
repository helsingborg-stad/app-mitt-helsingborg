import React, { useEffect, useState, useContext } from "react";
import { ActivityIndicator, SafeAreaView, ScrollView } from "react-native";
import styled from "styled-components/native";
import moment from "moment";
import { getHistoricalAttendees } from "../../services/BookingService";
import { getReferenceCodeForUser } from "../../helpers/BookingHelper";
import AuthContext from "../../store/AuthContext";
import { Text } from "../../components/atoms";
import { BookablesService } from "../../services";

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
  const { user } = useContext(AuthContext);

  const [isLoading, setLoading] = useState(true);
  const [buttons, setButtons] = useState<ButtonItem[]>([]);
  const [error, setError] = useState<Error | undefined>(undefined);

  useEffect(() => {
    let canceled = false;

    const fetchData = async () => {
      try {
        const bookables = await BookablesService.getBookables();
        let contactsList: string[] = [];
        try {
          contactsList = await getHistoricalAttendees(
            getReferenceCodeForUser(user),
            moment().subtract(6, "months").format(),
            moment().add(6, "months").format()
          );
        } catch (err) {
          console.log(err);
        }
        const contacts: ButtonItem[] =
          contactsList.length > 0
            ? [
                {
                  underline: true,
                  buttonText: "Mina kontakter",
                  icon: "person",
                  onClick: () =>
                    onChangeModalScreen(ModalScreen.BookingForm, {
                      isContactsMode: true,
                      contactsList,
                    }),
                },
              ]
            : [];

        if (!canceled) {
          const buttonItems: ButtonItem[] = contacts.concat(
            bookables.map((bookable) => ({
              variant: "link",
              buttonText: bookable.name,
              icon: "photo-camera",
              onClick: () =>
                onChangeModalScreen(ModalScreen.BookingForm, bookable),
            }))
          );
          setButtons(buttonItems);
          setLoading(false);
        }
      } catch (err) {
        console.log(err);
        setError(err as Error);
        setLoading(false);
      }
    };
    void fetchData();
    return () => {
      canceled = true;
    };
  }, [user, onChangeModalScreen]);

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={{ backgroundColor: "white" }}
    >
      <SafeAreaView style={{ backgroundColor: "white" }}>
        {isLoading && (
          <ActivityIndicator
            size="large"
            color="slategray"
            style={{ marginTop: 30 }}
          />
        )}
        {error && (
          <ErrorText type="h5">
            Ett fel har inträffat. Vänligen försök igen.
          </ErrorText>
        )}
        {!error &&
          !isLoading &&
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
