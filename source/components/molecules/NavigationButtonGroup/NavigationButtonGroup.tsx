import React, { useState } from "react";
import type { NativeScrollEvent, NativeSyntheticEvent } from "react-native";

import NavigationButtonField from "../NavigationButtonField/NavigationButtonField";

import { HorizontalScrollIndicator } from "../../atoms";

import ScrollContainer from "./NavigationButtonGroup.styled";

import type { Props } from "./NavigationButtonGroup.types";

const NavigationButtonGroup: React.FC<Props> = ({
  buttons,
  horizontal,
  formNavigation,
  colorSchema,
}) => {
  const [horizontalScrollPercentage, setHorizontalScrollPercentage] =
    useState(0);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (horizontal) {
      setHorizontalScrollPercentage(
        event.nativeEvent.contentOffset.x /
          (event.nativeEvent.contentSize.width -
            event.nativeEvent.layoutMeasurement.width)
      );
    }
  };
  return (
    <>
      <ScrollContainer
        horizontal={horizontal}
        onScroll={handleScroll}
        showsHorizontalScrollIndicator={false}
      >
        {buttons.map((button) => (
          <NavigationButtonField
            key={`button${button.navigationType.stepId}`}
            iconName={button.iconName}
            text={button.text}
            colorSchema={colorSchema}
            navigationType={button.navigationType}
            formNavigation={formNavigation}
          />
        ))}
      </ScrollContainer>
      {horizontal && (
        <HorizontalScrollIndicator percentage={horizontalScrollPercentage} />
      )}
    </>
  );
};

export default NavigationButtonGroup;
