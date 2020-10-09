import React from 'react';
import PropTypes from 'prop-types';
import { ScrollView } from 'react-native-gesture-handler';
import NavigationButtonField, {
  Props as ButtonProps,
} from '../NavigationButtonField/NavigationButtonField';

interface Props {
  buttons: ButtonProps[];
  horizontal: boolean;
  formNavigation: {
    next: () => void;
    back: () => void;
    down: (targetStepId: string) => void;
    up: () => void;
  };
}

const NavigationButtonGroup: React.FC<Props> = ({ buttons, horizontal, formNavigation }) => (
  <ScrollView horizontal={horizontal}>
    {buttons.map((button, index) => (
      <NavigationButtonField {...button} formNavigation={formNavigation} key={`button${index}`} />
    ))}
  </ScrollView>
);

NavigationButtonGroup.propTypes = {
  horizontal: PropTypes.bool,
  buttons: PropTypes.array,
  formNavigation: PropTypes.any,
};

export default NavigationButtonGroup;
