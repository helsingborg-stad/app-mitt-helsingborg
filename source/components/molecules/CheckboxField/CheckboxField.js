import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { TouchableHighlight } from 'react-native';
import { Checkbox, Text } from 'source/components/atoms';
import { HelpButton } from 'source/components/molecules';
import theme from '../../../styles/theme';

const FlexContainer = styled.View`
  flex: auto;
  flex-direction: row;
  margin: 8px;
`;
// TODO: MOVE TO THEME.
const sizes = {
  small: {
    padding: 0.25,
    margin: 4,
    marginTop: 0,
    fontSize: 16,
  },
  medium: {
    padding: 0.5,
    margin: 4,
    fontSize: 18,
  },
  large: {
    padding: 1,
    margin: 5,
    fontSize: 20,
  },
};

// TODO: THEME/STYLING TEXT SHOULD BE ABLE TO TAKE COLOR PROPS ie <Text color="blue" />
// THIS WOULD REMOVE THE USAGE OF THIS WRAPPER COMPONENT.
const CheckboxFieldText = styled(Text)`
  color: ${props => props.theme.checkboxField[props.color].text};
`;

const CheckboxField = props => {
  const { text, color, size, value, onChange, help, ...other } = props;
  let boolValue;
  if (typeof value === 'boolean') {
    boolValue = value;
  } else {
    boolValue = value === 'true';
  }
  const update = () => onChange(!boolValue);

  // TODO: THEME/STYLING SET STYLING IN A STYLED COMPONENT THAT WRAPS TOUCHABLEHIGHLIGHT
  const backgroundStyle = {
    marginLeft: -24,
    marginRight: -24,
    paddingLeft: 24,
    paddingRight: 24,
    backgroundColor:
      'transparent' /* boolValue ? 'transparent' : colors.checkbox[color].checkedBackground */,
  };

  return (
    <TouchableHighlight
      underlayColor="transparent" // {colors.checkbox[color].checkedBackground}
      style={backgroundStyle}
      onPress={update}
    >
      <FlexContainer>
        <Checkbox color={color} size={size} onChange={update} checked={boolValue} {...other} />
        <CheckboxFieldText color={color}>{text}</CheckboxFieldText>
        {Object.keys(help).length > 0 && <HelpButton {...help} />}
      </FlexContainer>
    </TouchableHighlight>
  );
};

CheckboxField.propTypes = {
  /**
   * The text to show at the side of the checkbox.
   */
  text: PropTypes.string,
  /**
   * Boolean that determines if the checkbox is checked or not. Manages the 'state' of the component.
   */
  value: PropTypes.bool.isRequired,
  /**
   * What happens when the checkbox is clicked. Should switch the checked prop.
   */
  onChange: PropTypes.func,
  /**
   * sets the color theme.
   */
  color: PropTypes.oneOf(Object.keys(theme.checkboxField)),
  /**
   * One of small, medium, large
   */
  size: PropTypes.oneOf(Object.keys(sizes)),
  /**
   * Disables the checkbox if true.
   */
  disabled: PropTypes.bool,
  /**
   * Properties to show help button both for text or link
   */
  help: PropTypes.shape({
    text: PropTypes.string,
    size: PropTypes.number,
    heading: PropTypes.string,
    tagline: PropTypes.string,
    url: PropTypes.string,
  }),
};

CheckboxField.defaultProps = {
  onChange: () => {},
  color: 'light',
  size: 'small',
  disabled: false,
  help: {},
};

export default CheckboxField;
