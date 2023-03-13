import React from "react";

import { storiesOf } from "@storybook/react-native";
import styled from "styled-components/native";

import StoryWrapper from "../StoryWrapper";
import ContactCard from "./index";

const FlexContainer = styled.ScrollView`
  background-color: #fff;
  padding: 16px;
`;

storiesOf("ContactCard", module).add("Default", () => (
  <StoryWrapper>
    <FlexContainer>
      <ContactCard
        name="Karl Svensson"
        description="Kontakta **Karl** på telefon genom att ringa [076 123 45 67](https://example.com). Alternativt via e-post [karl@example.com](mailto://karl@example.com)."
      />
    </FlexContainer>
  </StoryWrapper>
));
