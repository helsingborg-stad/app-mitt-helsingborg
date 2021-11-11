import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  SafeAreaView,
  ScrollView,
} from "react-native";
import styled from "styled-components/native";
import { Text } from "../../components/atoms";
import { BookableItem } from "../../services/BookablesService";
import { BookablesService } from "../../services";
import theme from "../../styles/theme";

import ButtonList from "../../components/organisms/ButtonList";

const ErrorText = styled(Text)`
  margin: 16px;
`;

interface Props {
  onNavigate: (newRoute: string) => void;
}

type ButtonType = {
  buttonText: string;
  icon: string;
  onClick: () => void;
};

const ServiceSelection = ({ onNavigate }: Props): JSX.Element => {
  const [isLoading, setLoading] = useState(true);
  const [buttons, setButtons] = useState<ButtonType[]>([]);
  const [error, setError] = useState<Error | undefined>(undefined);

  useEffect(() => {
    let canceled = false;
    BookablesService.getBookables()
      .then((bookables: BookableItem[]) => {
        if (!canceled) {
          setButtons(
            bookables.map(
              (bookable: BookableItem) =>
                ({
                  buttonText: bookable.name,
                  icon: "photo-camera",
                  onClick: () => true,
                } as ButtonType)
            )
          );
          setLoading(false);
        }
      })
      .catch((serviceError) => {
        setError(serviceError);
        setLoading(false);
      });
    return () => {
      canceled = true;
    };
  }, []);

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
        {!error && !isLoading && (
          <ButtonList
            buttonList={buttons}
            defaultColorSchema="red"
            defaultVariant="link"
          />
        )}
      </SafeAreaView>
    </ScrollView>
  );
};

export default ServiceSelection;
