import React from "react";

import { Icon } from "../../atoms";
import type { Props } from "./ApiStatusMessage.types";
import ContainerMap, {
  MessageText,
  styleTypeMap,
} from "./ApiStatusMessage.styled";

function ApiStatusMessage({ message, type }: Props): JSX.Element {
  const MessageContainer = ContainerMap[type];
  const { iconName, color } = styleTypeMap[type];

  return (
    <MessageContainer>
      <Icon size={48} name={iconName} />
      <MessageText strong align="center" color={color}>
        {message.title}
      </MessageText>
      <MessageText align="center" color={color}>
        {message.text}
      </MessageText>
    </MessageContainer>
  );
}

export default ApiStatusMessage;
