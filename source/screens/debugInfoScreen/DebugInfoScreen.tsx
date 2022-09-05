import React from "react";

import Header from "../../components/molecules/Header";

import getDebugInfo from "../../helpers/debugInfo/debugInfo";
import { Text } from "../../components/atoms";
import useAsync from "../../hooks/useAsync";
import {
  DebugInfoScreenWrapper,
  Container,
  MarginedText,
  MarginButton,
} from "./DebugInfoScreen.styled";

import type { Props } from "./DebugInfoScreen.types";
import DebugInfo from "../../components/organisms/DebugInfo";

export default function DebugInfoScreen({ navigation }: Props): JSX.Element {
  const [isLoading, debugInfo, error] = useAsync(getDebugInfo);

  return (
    <DebugInfoScreenWrapper>
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

        <DebugInfo debugInfo={debugInfo} />

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
    </DebugInfoScreenWrapper>
  );
}
