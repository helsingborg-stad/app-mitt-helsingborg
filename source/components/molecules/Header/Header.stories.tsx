/* eslint-disable react/jsx-props-no-spreading */
import React from "react";
import { storiesOf } from "@storybook/react-native";
import { action } from "@storybook/addon-actions";
import Header from "./Header";
import StoryWrapper from "../StoryWrapper";

const PlainHeader = () => <Header />;
const HeaderWithmessage = () => <Header message="Header Message" />;
const HeaderWithTitle = () => (
  <Header message="Header Message" title="Header Title" />
);

const HeaderWithBackButton = () => (
  <Header
    message="Header Message"
    title="Cool"
    backButton={{ text: "Go back", onClick: action("clicked back button") }}
  />
);

const HeaderTitleColor = () => (
  <Header themeColor="green" message="Header message" title="Header Title" />
);

const navItems = [
  {
    id: 1,
    active: false,
    title: "Navigation",
  },
  {
    id: 2,
    active: true,
    title: "Navigation",
  },
];

const HeaderWithNavigation = () => (
  <StoryWrapper>
    <Header message="Header Message" title="Header Title" navItems={navItems} />
  </StoryWrapper>
);

storiesOf("Header", module)
  .add("Plain header", (props) => (
    <StoryWrapper {...props}>
      <PlainHeader />
    </StoryWrapper>
  ))
  .add("Header with message", (props) => (
    <StoryWrapper {...props}>
      <HeaderWithmessage />
    </StoryWrapper>
  ))
  .add("Header title color", (props) => (
    <StoryWrapper {...props}>
      <HeaderTitleColor />
    </StoryWrapper>
  ))
  .add("Header with title", (props) => (
    <StoryWrapper {...props}>
      <HeaderWithTitle />
    </StoryWrapper>
  ))
  .add("Header with back button", (props) => (
    <StoryWrapper {...props}>
      <HeaderWithBackButton />
    </StoryWrapper>
  ))
  .add("Header with navigation", (props) => (
    <StoryWrapper {...props}>
      <HeaderWithNavigation />
    </StoryWrapper>
  ));
