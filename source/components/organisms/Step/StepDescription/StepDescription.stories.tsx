import React from "react";
import { storiesOf } from "@storybook/react-native";
import StoryWrapper from "../../../molecules/StoryWrapper";
import StepDescription from "./StepDescription";

const lorem =
  "Step Desciprtion Text: Etiam porta sem malesuada magna mollis euismod. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.Donec sed odio dui.Morbi leo risus, porta ac consectetur ac, vestibulum at eros.Etiam porta sem malesuada magna mollis euismod.Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus.Curabitur blandit tempus porttitor.";

const customTheme = {
  step: {
    text: {
      colors: {
        primary: "red",
        secondary: "blue",
      },
    },
  },
};
storiesOf("StepDescription", module)
  .add("Default", () => (
    <StoryWrapper>
      <StepDescription heading="Step Description Component" />
    </StoryWrapper>
  ))
  .add("Tagline", () => (
    <StoryWrapper>
      <StepDescription
        tagline="Blue tagline"
        heading="Step Description Heading"
      />
      <StepDescription
        tagline="Red tagline"
        colorSchema="red"
        heading="Step Description Heading"
      />
      <StepDescription
        tagline="Purple tagline"
        colorSchema="purple"
        heading="Step Description Heading"
      />
      <StepDescription
        tagline="Green tagline"
        colorSchema="green"
        heading="Step Description Heading"
        currentStep={2}
        totalStepNumber={5}
      />
    </StoryWrapper>
  ))
  .add("Desciprtive Text", () => (
    <StoryWrapper>
      <StepDescription text={lorem} heading="Step Description Heading" />
    </StoryWrapper>
  ))
  .add("Tagline && Desciprtive Text", () => (
    <StoryWrapper>
      <StepDescription
        tagline="Step Description Tagline"
        text={lorem}
        heading="Step Description Heading"
        currentStep={4}
        totalStepNumber={8}
      />
    </StoryWrapper>
  ))
  .add("Custom Theming", () => (
    <StoryWrapper>
      <StepDescription
        theme={customTheme}
        tagline="Step Description Tagline"
        text={lorem}
        heading="Step Description Heading"
      />
    </StoryWrapper>
  ));
