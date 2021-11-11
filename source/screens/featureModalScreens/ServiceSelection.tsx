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

const ErrorText = styled(Text)`
  margin: 16px;
`;

interface Props {
  onNavigate: (newRoute: string) => void;
}

type ButtonItem = {
  buttonText: string;
  icon: string;
  onClick: () => void;
};

const ServiceSelection = ({ onNavigate }: Props): JSX.Element => {
  const [isLoading, setLoading] = useState(true);
  const [buttons, setButtons] = useState<ButtonItem[]>([]);
  const [error, setError] = useState<Error | undefined>(undefined);

  const fetchData = async () => {
    let canceled = false;
    try {
      const bookables = await BookablesService.getBookables();
      if (!canceled) {
        if (bookables.length === 0) {
          throw new Error("Det finns inga tjänster tillgängliga just nu.");
        }
        const buttonItems: ButtonItem[] = bookables.map((bookable) => ({
          buttonText: bookable.name,
          icon: "photo-camera",
          onClick: () => true,
        }));
        setButtons(buttonItems);
        setLoading(false);
      }
    } catch (serviceError) {
      setError(serviceError as Error);
      setLoading(false);
    }
    return () => {
      canceled = true;
    };
  };

  useEffect(() => {
    fetchData();
  }, [onNavigate]);

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
