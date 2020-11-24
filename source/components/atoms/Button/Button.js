import React from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components/native';
import SHADOW from '../../../styles/shadow';
import Text from '../Text';
import Icon from '../Icon';

/** Button styles */
const Styles = { elevation: SHADOW };

/* Styles common to all buttons */
Styles.buttonbase = css`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  max-width: 100%;
  border-radius: 4.5px;
  background-color: ${props =>
    props.colorSchema === 'neutral'
      ? props.theme.colors.neutrals[1]
      : props.theme.colors.primary[props.colorSchema][0]};
`;

/* Styles for different button variants outlined, contained etc */
Styles.outlined = css`
  border: 2px solid
    ${props =>
      props.colorSchema === 'neutral'
        ? props.theme.colors.neutrals[2]
        : props.theme.colors.primary[props.colorSchema][1]};
  background-color: ${props =>
    props.colorSchema === 'neutral'
      ? props.theme.colors.neutrals[5]
      : props.theme.colors.complementary[props.colorSchema][1]};
  ${Styles.elevation[0]}
`;

const ButtonIcon = styled(Icon)`
  color: ${props =>
    props.variant === 'outlined'
      ? props.theme.colors.primary[props.colorSchema][1]
      : props.theme.colors.neutrals[7]};
  font-size: 26px;
  height: 26px;
  width: 26px;
  line-height: 26px;
  ${props =>
    props.variant === 'link' &&
    `
    height: 20px;
    width: 18px;
    font-size: 20px;
    line-height: 20px;
    color: ${
      props.colorSchema === 'neutral'
        ? `${props.theme.colors.neutrals[2]}`
        : `${props.theme.colors.primary[props.colorSchema][1]}`
    };
  `}
`;

const LeftButtonIcon = styled(ButtonIcon)`
  margin-right: 16px;
  ${props => (props.push ? 'margin-right: auto;' : null)}
`;

const RightButtonIcon = styled(ButtonIcon)`
  margin-left: 16px;
  ${props => (props.push ? 'margin-left: auto;' : null)}
`;

Styles.link = css`
  padding: 6px 10px;
  justify-content: flex-start;
  ${props => {
    const lastChild = props.children[React.Children.count(props.children) - 1];
    if (lastChild && lastChild.type === RightButtonIcon) {
      return `justify-content: space-between;`;
    }
  }}
  background-color: ${props =>
    props.colorSchema === 'neutral'
      ? props.theme.colors.neutrals[5]
      : props.theme.colors.complementary[props.colorSchema][1]};
`;

Styles.contained = css``;

/* Styles for size variants */
Styles.small = css`
  font-size: 14px;
  padding: 4px 8px;
  min-width: 10px;
`;

Styles.medium = css`
  font-size: 16px;
  padding: 10px 32px;
  min-width: 10px;
`;

Styles.fullWidth = css`
  width: 100%;
`;

/* Styles for a disabled button */
Styles.disabled = css`
  opacity: 0.2;
  background-color: #e5e5e5;
`;

const ButtonBase = styled.View`
    ${Styles.buttonbase};

    padding: ${props => (!props.icon ? '12px 20px' : '16px 16px')};
    min-width: ${props => (!props.icon ? '124px' : '169px')};

    ${props => props.disabled && Styles.disabled}
    ${props => props.fullWidth && Styles.fullWidth}

    ${props => props.size === 'small' && Styles.small}
    ${props => props.size === 'medium' && Styles.medium}
    ${props => props.size === 'large' && Styles.large}

    ${props => props.size === 'large' && Styles.large}

    ${props => Styles.elevation[props.elevation]}

    shadow-color: ${props =>
      props.colorSchema === 'neutral'
        ? props.theme.button.gray.shadow
        : props.theme.button[props.colorSchema].shadow};

    ${props => Styles[props.variant]}
`;

/** Button child component overrides */
const ButtonText = styled(Text)`
  font-weight: ${props => props.theme.fontWeights[1]};
  color: ${props =>
    props.variant === 'outlined' ? props.theme.colors.neutrals[1] : props.theme.colors.neutrals[7]};
  ${props =>
    props.variant === 'link' &&
    `
    color: ${
      props.colorSchema === 'neutral'
        ? `${props.theme.colors.neutrals[2]}`
        : `${props.theme.colors.primary[props.colorSchema][1]}`
    };
  `}
`;

/** Button utils */
const ButtonWrapper = styled.View`
  flex-direction: row;
`;

const ButtonTouchable = styled.TouchableOpacity`
    ${props => (props.block ? 'flex: 1;' : null)};
    ${props => Styles.elevation[props.elevation]}
    shadow-color: ${props => props.theme.shadow.default};
`;

const Button = props => {
  const {
    value,
    onClick,
    style,
    colorSchema,
    block,
    icon,
    z: elevation,
    size,
    disabled,
    variant,
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
        variant,
      });
    }

    /** Text */
    if (child && child.type === Text) {
      return React.createElement(ButtonText, {
        ...child.props,
        colorSchema,
        size,
        variant,
      });
    }

    return child;
  });

  return (
    <ButtonWrapper>
      <ButtonTouchable disabled={disabled} onPress={onClick} block={block} elevation={elevation}>
        <ButtonBase
          colorSchema={colorSchema}
          size={size}
          style={style}
          icon={iconComponentsTotal === 1 && childrenTotal === 1 ? true : icon}
          elevation={elevation}
          disabled={disabled}
          variant={variant}
        >
          {children || (value ? <ButtonText>{value}</ButtonText> : null)}
        </ButtonBase>
      </ButtonTouchable>
    </ButtonWrapper>
  );
};

Button.propTypes = {
  /**
   * The button layout variant to use.
   */
  variant: PropTypes.oneOf(['outlined', 'contained', 'link']),
  /**
   * If true, the button will take up the full width of its container.
   */
  block: PropTypes.bool,
  /**
   * The color schema of the component. colors is defined in the application theme.
   */
  colorSchema: PropTypes.oneOf(['neutral', 'blue', 'red', 'purple', 'green']),
  /**
   * If true button will display Icon component passed as children.
   */
  icon: PropTypes.bool,
  onClick: PropTypes.func,
  /**
   * The size of the button. small is equivalent to the dense button styling.
   */
  size: PropTypes.oneOf(['small', 'medium']),
  /**
   * Override or extend the styles applied to the component.
   */
  style: PropTypes.array,
  /**
   * The text value to display in the button.
   */
  value: PropTypes.string,
  /**
   * If true, the button will be disabled.
   */
  disabled: PropTypes.bool,
  z: PropTypes.oneOf(Object.keys(SHADOW).map(number => parseInt(number))),
};

Button.defaultProps = {
  colorSchema: 'blue',
  icon: false,
  z: 1,
  size: 'medium',
  disabled: false,
  variant: 'contained',
};

export default Button;
