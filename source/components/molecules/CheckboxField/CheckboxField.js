import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { TouchableHighlight } from 'react-native';
import { Checkbox, Text } from 'source/components/atoms';
import { HelpButton } from 'source/components/molecules';
import colors from '../../../styles/colors';

const FlexContainer = styled.View`
  flex: auto;
  flex-direction: row;
  margin: 8px;
`;

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

const CheckboxField = props => {
  const { text, color, size, value, onChange, help, ...other } = props;
  const textStyle = {
    color: colors.checkboxField[color].text,
    ...sizes[size],
  };
  let boolValue;
  if (typeof value === 'boolean') {
    boolValue = value;
  } else {
    boolValue = value === 'true';
  }
  const update = () => onChange(!boolValue);

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
        <Text style={textStyle}>{text}</Text>
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
  color: PropTypes.oneOf(Object.keys(colors.checkboxField)),
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
