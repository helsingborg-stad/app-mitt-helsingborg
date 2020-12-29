import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import NavigationButtonField, {
  Props as ButtonProps,
} from '../NavigationButtonField/NavigationButtonField';
import { PrimaryColor } from '../../../styles/themeHelpers';
import { HorizontalScrollIndicator } from '../../atoms';

const ScrollContainer = styled.ScrollView`
  padding-bottom: 16px;
`;
interface Props {
  buttons: ButtonProps[];
  horizontal: boolean;
  formNavigation: {
    next: () => void;
    back: () => void;
    down: (targetStepId: string) => void;
    up: () => void;
  };
  colorSchema?: PrimaryColor;
}

const NavigationButtonGroup: React.FC<Props> = ({
  buttons,
  horizontal,
  formNavigation,
  colorSchema,
}) => {
  const [horizontalScrollPercentage, setHorizontalScrollPercentage] = useState(0);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (horizontal) {
      setHorizontalScrollPercentage(
        event.nativeEvent.contentOffset.x /
          (event.nativeEvent.contentSize.width - event.nativeEvent.layoutMeasurement.width)
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
        {buttons.map((button, index) => (
          <NavigationButtonField
            {...{ colorSchema, ...button }}
            formNavigation={formNavigation}
            key={`button${index}`}
          />
        ))}
      </ScrollContainer>
      {horizontal && <HorizontalScrollIndicator percentage={horizontalScrollPercentage} />}
    </>
  );
};

NavigationButtonGroup.propTypes = {
  horizontal: PropTypes.bool,
  buttons: PropTypes.array,
  formNavigation: PropTypes.any,
  colorSchema: PropTypes.oneOf(['blue', 'red', 'green', 'purple', 'neutral']),
};

export default NavigationButtonGroup;
