import React from "react";
import { Button, Icon, Text } from "../../atoms";

import ButtonFieldWrapper from "./NavigationButtonField.styled";

import type { Props } from "./NavigationButtonField.types";

// TODO: Move navigation logic to a smart container component,
// this dumb component do not need to know about how formNavigation is handled.
// Only that an onClick event should be triggered.
const NavigationButtonField: React.FC<Props> = ({
  iconName,
  text,
  navigationType,
  formNavigation,
  colorSchema = "blue",
}) => {
  const onClick = () => {
    // This logic could be broken out and placed elsewhere.
    switch (navigationType.type) {
      case "navigateDown":
        formNavigation.createSnapshot();
        formNavigation.down(navigationType.stepId);
        break;
      case "navigateUp":
        formNavigation.up();
        break;
      case "navigateNext":
        formNavigation.next();
        break;
      case "navigateBack":
        formNavigation.back();
        break;

      default:
        break;
    }
  };

  return (
    <ButtonFieldWrapper>
      <Button variant="outlined" onClick={onClick} colorSchema={colorSchema}>
        <Icon color="red" name={iconName || "add"} />
        {text && <Text>{text}</Text>}
      </Button>
    </ButtonFieldWrapper>
  );
};

export default NavigationButtonField;
