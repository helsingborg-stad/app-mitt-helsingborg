import React, { useState } from "react";
import { storiesOf } from "@storybook/react-native";
import styled from "styled-components/native";

import StoryWrapper from "../StoryWrapper";
import Text from "../../atoms/Text";

import CollapsibleSection from "./CollapsibleSection";

const FlexContainer = styled.ScrollView`
  background-color: #fff;
  flex: 1;
`;

const Children = () => (
  <Text style={{ margin: 0, padding: 0, height: 300, backgroundColor: "red" }}>
    This is my awesome children text
  </Text>
);

const OverviewExamples = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleIconClick = () => {
    setIsCollapsed((oldValue) => !oldValue);
  };

  return (
    <FlexContainer>
      <Text type="h5">Default design</Text>
      <CollapsibleSection
        title="Section title"
        collapsed={isCollapsed}
        onPress={handleIconClick}
      >
        <Children />
      </CollapsibleSection>
    </FlexContainer>
  );
};

storiesOf("Collapsible section", module).add(
  "Overview examples",
  ({ style, kind, name, children }) => (
    <StoryWrapper style={style} kind={kind} name={name}>
      {children}
      <OverviewExamples />
    </StoryWrapper>
  )
);
