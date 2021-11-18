import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  SafeAreaView,
  ScrollView,
} from "react-native";
import styled from "styled-components/native";
import { Text } from "../../components/atoms";
import { BookablesService } from "../../services";
import theme from "../../styles/theme";

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
  buttonText: string;
  icon: string;
  onClick: () => void;
};

const ServiceSelection = ({ onChangeModalScreen }: Props): JSX.Element => {
  const [isLoading, setLoading] = useState(true);
  const [buttons, setButtons] = useState<ButtonItem[]>([]);
  const [error, setError] = useState<Error | undefined>(undefined);

  useEffect(() => {
    let canceled = false;
    const fetchData = async () => {
      try {
        const bookables = await BookablesService.getBookables();
        if (!canceled) {
          const buttonItems: ButtonItem[] = bookables.map((bookable) => ({
            buttonText: bookable.name,
            icon: "photo-camera",
            onClick: () => true,
          }));
          setButtons(buttonItems);
          setLoading(false);
        }
      } catch (err) {
        setError(err as Error);
        setLoading(false);
      }
    };
    void fetchData();
    return () => {
      canceled = true;
    };
  }, [onChangeModalScreen]);

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={{ backgroundColor: "white" }}
    >
      <SafeAreaView style={{ backgroundColor: "white" }}>
        {isLoading && (
          <ActivityIndicator
            size="large"
            color={
              Platform.OS === "ios" ? undefined : theme.colors.primary.red[0]
            }
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
              defaultVariant="link"
            />
          ))}
      </SafeAreaView>
    </ScrollView>
  );
};

export default ServiceSelection;
