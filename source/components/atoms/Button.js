import React from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';
import styled, { ThemeProvider, css } from 'styled-components/native';

import z from '../../styles/shadow';

import Text from './Text';
import Icon from './Icon';

const ButtonNew = props => {
  const { value, onClick, style, color, block, rounded, pill, sharp, icon, z, size } = props;

  const childrenTotal = React.Children.count(props.children);

  let iconComponentsTotal = 0;
  let textComponentsTotal = 0;

  /** Override child components */
  const children = React.Children.map(props.children, (child, index) => {
    /** Icon */
    if (child.type === Icon) {
      iconComponentsTotal++;

      let ButtonComponent = ButtonIcon;

      if (childrenTotal > 1 && index > 0) {
        ButtonComponent = RightButtonIcon;
      }

      if (childrenTotal > 1 && index === 0) {
        ButtonComponent = LeftButtonIcon;
      }

      return React.createElement(ButtonComponent, { ...child.props, size: 32, buttonTheme: color });
    }

    /** Text */
    if (child.type === Text) {
      textComponentsTotal++;
      return React.createElement(ButtonText, {
        ...child.props,
        buttonTheme: color,
        buttonSize: size,
      });
    }

    return child;
  });

  return (
    <ButtonWrapper>
      <ButtonTouchable onPress={onClick} block={block} z={z}>
        <ButtonBase
          buttonTheme={color}
          buttonSize={size}
          rounded={rounded}
          pill={pill}
          style={style}
          icon={iconComponentsTotal === 1 && childrenTotal === 1 ? true : icon}
          z={z}
          shrarp={sharp}
        >
          {children || (value ? <ButtonText>{value}</ButtonText> : null)}
        </ButtonBase>
      </ButtonTouchable>
    </ButtonWrapper>
  );
};

ButtonNew.defaultProps = {
  color: 'light',
  rounded: false,
  pill: false,
  icon: false,
  sharp: false,
  z: 1,
  size: 'medium',
};

/** Button styles */
const ButtonBase = styled.View`
    flex-direction: row;
    justify-content: center;
    align-items: center;

    max-width: 100%;
    min-height: 56px;

    border-radius: 12.5px;

    padding: ${props => (!props.icon ? '12px 20px' : '16px 16px')};
    min-width: ${props => (!props.icon ? '124px' : 'auto')};
    background-color: ${props => props.theme.button[props.buttonTheme].background};

    ${props => (props.rounded ? CSS.buttonRounded : null)}
    ${props => (props.pill ? CSS.buttonPill : null)}
    ${props => (props.sharp ? CSS.buttonSharp : null)}
    
    ${props => (props.buttonSize === 'small' ? CSS.buttonSmall : null)}

    ${props => CSS.z[props.z]}
    shadow-color: ${props => props.theme.button[props.buttonTheme].shadow};
`;

/** Button modifiers */
const CSS = { z };

CSS.buttonRounded = css`
  border-radius: 17.5px;
`;

CSS.buttonPill = css`
  border-radius: 24.5px;
`;

CSS.buttonSharp = css`
  border-radius: 0px;
`;

CSS.buttonSmall = css`
  padding: 10px 12px;
  min-height: 36px;
  min-width: 74px;
`;

/** Button child component overrides */
const ButtonText = styled(Text)`
  font-size: ${props => (props.buttonSize === 'small' ? '14px' : '16px')};
  color: ${props => props.theme.button[props.buttonTheme].text};

  ${props => (props.buttonSize === 'small' ? 'font-weight: bold;' : null)};
`;

const ButtonIcon = styled(Icon)`
  color: ${props => (props.color ? props.color : props.theme.button[props.buttonTheme].icon)};
  font-size: 26px;
  height: 26px;
  width: 26px;
  line-height: 26px;
`;

const LeftButtonIcon = styled(ButtonIcon)`
  margin-right: 16px;
  ${props => (props.push ? 'margin-right: auto;' : null)}
`;

const RightButtonIcon = styled(ButtonIcon)`
    margin-left: 16px;
    ${props => (props.push ? 'margin-left: auto;' : null)}
    
    color: ${props => props.theme.button[props.buttonTheme].iconRight};
`;

/** Button utils */
const ButtonWrapper = styled.View`
  flex-direction: row;
`;

const ButtonTouchable = styled.TouchableOpacity`
    ${props => (props.block ? 'flex: 1;' : null)};
    ${props => CSS.z[props.z]}
    shadow-color: ${props => props.theme.shadow.default};
`;

export default ButtonNew;
