import React from "react";
import { ApiStatusMessage } from "../../molecules";
import MessagesContainer from "./ApiStatusMessages.styled";
import type { Props } from "./ApiStatusMessages.types";

function ApiStatusMessages({ messages }: Props): JSX.Element {
  return (
    <MessagesContainer>
      {messages.map((item) => (
        <ApiStatusMessage
          key={item.message.title}
          type={item.type}
          message={item.message}
        />
      ))}
    </MessagesContainer>
  );
}

export default ApiStatusMessages;
