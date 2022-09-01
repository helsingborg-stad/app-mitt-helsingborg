import React from "react";

import Clipboard from "@react-native-clipboard/clipboard";
import Header from "../../components/molecules/Header";
import { Text } from "../../components/atoms";
import { useNotification } from "../../store/NotificationContext";

import useAsync from "../../hooks/useAsync";
import {
  DebInfoScreenWrapper,
  Container,
  MarginedText,
  InfoContainer,
  CategoryContainer,
  CategoryTitle,
  CategoryErrorText,
  CategoryEntry,
  CategoryEntryName,
  CategoryEntryValue,
  MarginButton,
} from "./DebugInfoScreen.styled";
import getDebugInfo from "../../helpers/debugInfo/debugInfo";

interface Props {
  navigation: {
    navigate: (to: string) => void;
  };
}

export default function DebugInfoScreen({ navigation }: Props): JSX.Element {
  const showNotification = useNotification();

  const [isLoading, debugInfo, error] = useAsync(getDebugInfo);

  const copyDebugInfoToClipboard = () => {
    const asString = JSON.stringify(debugInfo);
    Clipboard.setString(asString);

    showNotification(
      "Felsökning",
      "Informationen har kopierats till urklippet.",
      "success",
      4000
    );
  };

  return (
    <DebInfoScreenWrapper>
      <Header title="Felsökning" />
      <Container>
        <MarginedText>
          Nedan kan du se information som kan vara relevant för felsökning.
        </MarginedText>

        {isLoading && (
          <MarginedText>Samlar felsökningsinformation...</MarginedText>
        )}

        {error && (
          <>
            <MarginedText>
              Ett fel uppstod vid insamling av felsökningsinformationen:
            </MarginedText>
            <MarginedText>{error.toString()}</MarginedText>
          </>
        )}

        {debugInfo && (
          <>
            <InfoContainer>
              {debugInfo.map((category) => (
                <CategoryContainer key={category.name}>
                  <CategoryTitle>{category.name}</CategoryTitle>
                  {category.errorMessage && (
                    <CategoryErrorText>
                      {category.errorMessage}
                    </CategoryErrorText>
                  )}
                  {category.entries &&
                    category.entries.map((entry) => (
                      <CategoryEntry key={`${category.name}-${entry.name}`}>
                        <CategoryEntryName>{entry.name}</CategoryEntryName>
                        <CategoryEntryValue>{entry.value}</CategoryEntryValue>
                      </CategoryEntry>
                    ))}
                </CategoryContainer>
              ))}
            </InfoContainer>

            <MarginButton
              block
              variant="outlined"
              colorSchema="neutral"
              onClick={copyDebugInfoToClipboard}
            >
              <Text>Kopiera till urklipp</Text>
            </MarginButton>
          </>
        )}

        <MarginButton
          block
          variant="contained"
          colorSchema="neutral"
          onClick={async () => {
            navigation.navigate("App");
          }}
        >
          <Text>Tillbaka</Text>
        </MarginButton>
      </Container>
    </DebInfoScreenWrapper>
  );
}
