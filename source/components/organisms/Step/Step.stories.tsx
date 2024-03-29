import React from "react";
import { storiesOf } from "@storybook/react-native";
import StoryWrapper from "../../molecules/StoryWrapper";
import Step from "./Step";
import ILLUSTRATION from "../../../assets/images/illustrations";
import ICON from "../../../assets/images/icons";

storiesOf("Step", module)
  .add("Default", () => (
    <StoryWrapper>
      <Step
        currentPosition={{
          index: 0,
          level: 0,
          currentMainStep: 1,
        }}
        heading="Step heading"
        tagline="Step tagline"
        description={{
          heading: "Vill du ansöka om Ekonomiskt bistånd igen?",
          tagline: "Ansökan",
          text: "Du kommer behöva ange inkomster, utgifter och kontrollera dina boende detaljer.",
        }}
        formNavigation={{
          next: () => console.log("clicked next"),
          back: () => console.log("clicked back"),
        }}
        footer={{
          buttons: [
            {
              label: "Nästa",
              onClick: () => console.log("clicked"),
            },
          ],
        }}
      />
    </StoryWrapper>
  ))
  .add("Hide back button", () => (
    <StoryWrapper>
      <Step
        banner={{
          imageSrc: ILLUSTRATION.INKOMSTER_MARGIN_2,
          iconSrc: ICON.ICON_INCOME,
        }}
        isBackBtnVisible={false}
        currentPosition={{
          index: 0,
          level: 0,
          currentMainStep: 1,
        }}
        formNavigation={{
          next: () => console.log("clicked next"),
          back: () => console.log("clicked back"),
        }}
        heading="Step heading"
        tagline="Step tagline"
        description={{
          heading: "Vill du ansöka om Ekonomiskt bistånd igen?",
          tagline: "Ansökan",
          text: "Du kommer behöva ange inkomster, utgifter och kontrollera dina boende detaljer.",
        }}
      />
    </StoryWrapper>
  ))
  .add("With validation", () => (
    <StoryWrapper>
      <Step
        banner={{
          iconSrc: "ICON_SUMMARY",
          imageSrc: "",
          backgroundColor: "",
        }}
        isBackBtnVisible={false}
        currentPosition={{
          index: 0,
          level: 0,
          currentMainStep: 1,
        }}
        formNavigation={{
          next: () => console.log("clicked next"),
          back: () => console.log("clicked back"),
        }}
        heading="Step heading"
        tagline="Step tagline"
        description={{
          heading: "Vill du ansöka om Ekonomiskt bistånd igen?",
          tagline: "Ansökan",
          text: "Du kommer behöva ange inkomster, utgifter och kontrollera dina boende detaljer.",
        }}
        answers={{}}
        questions={[
          {
            labelHelp:
              "Dina personliga uppgifter. Klicka på Ändra om det är någon uppgift som inte stämmer.",
            inputs: [
              {
                loadPrevious: ["telephone", "user.firstName"],
                key: "userName",
                label: "Namn",
              },
              {
                loadPrevious: ["personnummer"],
                key: "personnummer",
                label: "Personnummer",
              },
              {
                loadPrevious: ["telephone", "user.mobilePhone"],
                key: "telephone",
                label: "Telefon",
              },
              {
                loadPrevious: ["telephone", "user.email"],
                key: "email",
                label: "E-post",
              },
              {
                loadPrevious: ["employment"],
                key: "employment",
                label: "Sysselsättning",
              },
              {
                loadPrevious: ["citizenship"],
                key: "citizenship",
                label: "Medborgarskap",
              },
            ],
            description: "Personal Info",
            label: "Om dig",
            id: "personalInfo",
            type: "editableList",
            title: "Om dig",
          },
        ]}
      />
    </StoryWrapper>
  ));
