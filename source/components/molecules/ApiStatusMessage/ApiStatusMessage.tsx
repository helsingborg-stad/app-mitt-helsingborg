import React from "react";

import { Icon, Text } from "../../atoms";

import ApiStatusMessageContainer from "./ApiStatusMessage.styled";
import theme from "../../../theme/theme";

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
        align="center"
        style={{
          color: theme.colors.primary.red[0],
        }}
      >
        {message}
      </Text>
    </ApiStatusMessageContainer>
  );
}

export default ApiStatusMessage;
