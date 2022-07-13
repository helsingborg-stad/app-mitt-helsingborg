import React from "react";

import { Icon, Text } from "../../atoms";

import ApiStatusMessageContainer from "./ApiStatusMessage.styled";
import theme from "../../../styles/theme";

import type { Props } from "./ApiStatusMessage.types";

function ApiStatusMessage({ message }: Props): JSX.Element {
  return (
    <ApiStatusMessageContainer>
      <Icon
        name="error-outline"
        size={48}
        color={theme.colors.primary.red[2]}
      />
      <Text
        strong
        style={{
          color: theme.colors.primary.red[0],
          textAlign: "center",
        }}
      >
        {message}
      </Text>
    </ApiStatusMessageContainer>
  );
}

export default ApiStatusMessage;
