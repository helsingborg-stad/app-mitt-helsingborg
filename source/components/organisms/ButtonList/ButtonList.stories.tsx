import React from "react";
import { storiesOf } from "@storybook/react-native";
import StoryWrapper from "../../molecules/StoryWrapper";

import ButtonList from "./ButtonList";

const stories = storiesOf("Button List", module);

const buttons = [
  {
    buttonText: "Mina kontakter",
    icon: "person",
    onClick: () => true,
    colorSchema: "red",
    variant: "contained",
  },
  {
    buttonText: "Budget- och skuldrådgivning",
    icon: "photo-camera",
    onClick: () => true,
    colorSchema: "neutral",
  },
  {
    buttonText: "Kostnadsfri och oberoende energi- och klimatrådgivning",
    icon: "settings",
    onClick: () => true,
    colorSchema: "blue",
  },
  {
    buttonText: "Konsumentrådgivning",
    icon: "alarm",
    onClick: () => true,
  },
];

const StoryButtonList = () => (
  <ButtonList
    buttonList={buttons}
    defaultColorSchema="red"
    defaultVariant="link"
  />
);

stories.add("Default", () => (
  <StoryWrapper>
    <StoryButtonList />
  </StoryWrapper>
));
