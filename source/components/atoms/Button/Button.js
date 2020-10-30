import React from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components/native';

import SHADOW from '../../../styles/shadow';

import Text from '../Text';
import Icon from '../Icon';
import theme from '../../../styles/theme';

/** Button modifiers */
const CSS = { z: SHADOW };

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
  padding: 8px 12px;
  min-height: 36px;
  min-width: 74px;
`;

CSS.disabled = css`
  opacity: 0.2;
`;

const ButtonBase = styled.View`
    flex-direction: row;
    justify-content: center;
    align-items: center;

    max-width: 100%;
    min-height: 56px;

    border-radius: 4.5px;

    padding: ${props => (!props.icon ? '12px 20px' : '16px 16px')};
    min-width: ${props => (!props.icon ? '124px' : '169px')};
    background-color: ${props => props.theme.colors.primary[props.colorSchema][0]};

    ${props => (props.rounded ? CSS.buttonRounded : null)}
    ${props => (props.pill ? CSS.buttonPill : null)}
    ${props => (props.sharp ? CSS.buttonSharp : null)}
    ${props => (props.disabled ? CSS.disabled : null)}

    ${props => (props.buttonSize === 'small' ? CSS.buttonSmall : null)}

    ${props => CSS.z[props.z]}
    shadow-color: ${props => props.theme.button[props.colorSchema].shadow};
`;

/** Button child component overrides */
const ButtonText = styled(Text)`
  font-size: ${props => (props.buttonSize === 'small' ? '14px' : '16px')};
  font-weight: ${props => props.theme.fontWeights[1]};
  color: ${props => props.theme.colors.complementary[props.colorSchema][3]};

  ${props => (props.buttonSize === 'small' ? 'font-weight: bold;' : null)};
`;

const ButtonIcon = styled(Icon)`
  color: ${props => props.theme.colors.neutrals[7]};
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

const Button = props => {
  const {
    value,
    onClick,
    style,
    color,
    colorSchema,
    block,
    rounded,
    pill,
    sharp,
    icon,
    z: shadow,
    size,
    disabled,
    ...other
  } = props;

  const childrenTotal = React.Children.count(other.children);

  let iconComponentsTotal = 0;

  /** Override child components */
  const children = React.Children.map(other.children, (child, index) => {
    /** Icon */
    if (child && child.type === Icon) {
      iconComponentsTotal++;

      let ButtonComponent = ButtonIcon;

      if (childrenTotal > 1 && index > 0) {
        ButtonComponent = RightButtonIcon;
      }

      if (childrenTotal > 1 && index === 0) {
        ButtonComponent = LeftButtonIcon;
      }

      return React.createElement(ButtonComponent, {
        ...child.props,
        size: 32,
        colorSchema,
      });
    }

    /** Text */
    if (child && child.type === Text) {
      return React.createElement(ButtonText, {
        ...child.props,
        colorSchema,
        buttonSize: size,
      });
    }

    return child;
  });

  return (
    <ButtonWrapper>
      <ButtonTouchable disabled={disabled} onPress={onClick} block={block} z={shadow}>
        <ButtonBase
          colorSchema={colorSchema}
          buttonSize={size}
          rounded={rounded}
          pill={pill}
          style={style}
          icon={iconComponentsTotal === 1 && childrenTotal === 1 ? true : icon}
          z={shadow}
          shrarp={sharp}
          disabled={disabled}
        >
          {children || (value ? <ButtonText>{value}</ButtonText> : null)}
        </ButtonBase>
      </ButtonTouchable>
    </ButtonWrapper>
  );
};

Button.propTypes = {
  block: PropTypes.bool,
  color: PropTypes.oneOf(Object.keys(theme.button)),
  colorSchema: PropTypes.oneOf(['blue', 'red', 'purple', 'green']),
  icon: PropTypes.bool,
  onClick: PropTypes.func,
  pill: PropTypes.bool,
  rounded: PropTypes.bool,
  sharp: PropTypes.bool,
  size: PropTypes.string,
  style: PropTypes.array,
  value: PropTypes.string,
  disabled: PropTypes.bool,
  z: PropTypes.oneOf(Object.keys(SHADOW).map(number => parseInt(number))),
};

Button.defaultProps = {
  color: 'light',
  colorSchema: 'blue',
  rounded: false,
  pill: false,
  icon: false,
  sharp: false,
  z: 1,
  size: 'medium',
  disabled: false,
};

export default Button;
