import Clipboard from "@react-native-clipboard/clipboard";
import React from "react";

import { useNotification } from "../../../store/NotificationContext";
import { Text } from "../../atoms";
import {
  CategoryContainer,
  CategoryEntry,
  CategoryEntryName,
  CategoryEntryValue,
  CategoryErrorText,
  CategoryTitle,
  Container,
  InfoContainer,
  MarginButton,
} from "./DebugInfo.styled";

import type { Props } from "./DebugInfo.types";

export default function DebugInfo({ debugInfo }: Props): JSX.Element {
  const showNotification = useNotification();

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
    <Container>
      <InfoContainer>
        {debugInfo?.map((category) => (
          <CategoryContainer key={category.name}>
            <CategoryTitle>{category.name}</CategoryTitle>
            {category.errorMessage && (
              <CategoryErrorText>{category.errorMessage}</CategoryErrorText>
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
    </Container>
  );
}
