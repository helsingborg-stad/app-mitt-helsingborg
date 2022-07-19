import React from "react";
import { storiesOf } from "@storybook/react-native";

import StoryWrapper from "../StoryWrapper";

import ApiStatusMessage from "./ApiStatusMessage";

storiesOf("ApiStatusMessage", module).add("Default", () => (
  <StoryWrapper>
    <ApiStatusMessage message="My error message" />
  </StoryWrapper>
));
