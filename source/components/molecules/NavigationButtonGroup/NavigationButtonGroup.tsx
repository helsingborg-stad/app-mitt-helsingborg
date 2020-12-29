import React from 'react';
import PropTypes from 'prop-types';
import { ScrollView } from 'react-native-gesture-handler';
import NavigationButtonField, {
  Props as ButtonProps,
} from '../NavigationButtonField/NavigationButtonField';
import { PrimaryColor } from '../../../styles/themeHelpers';

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
}) => (
  <ScrollView horizontal={horizontal}>
    {buttons.map((button, index) => (
      <NavigationButtonField
        {...{ colorSchema, ...button }}
        formNavigation={formNavigation}
        key={`button${index}`}
      />
    ))}
  </ScrollView>
);

NavigationButtonGroup.propTypes = {
  horizontal: PropTypes.bool,
  buttons: PropTypes.array,
  formNavigation: PropTypes.any,
  colorSchema: PropTypes.oneOf(['blue', 'red', 'green', 'purple', 'neutral']),
};

export default NavigationButtonGroup;
