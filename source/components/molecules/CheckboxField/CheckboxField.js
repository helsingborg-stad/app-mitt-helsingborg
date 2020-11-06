import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import styled, { ThemeContext } from 'styled-components/native';
import { TouchableHighlight } from 'react-native';
import { HelpButton } from 'source/components/molecules';
import Text from '../../atoms/Text/Text';
import Checkbox from '../../atoms/Checkbox/Checkbox';
import theme, { getValidColorSchema } from '../../../styles/theme';

const FlexContainer = styled.View`
  flex: auto;
  flex-direction: row;
  align-items: flex-start;
  margin-left: -50px;
  margin-right: -50px;
  padding-left: 50px;
  padding-right: 50px;
  padding-top: ${props => props.theme.sizes[1]}px;
  padding-bottom: ${props => props.theme.sizes[1]}px;
  background-color: ${props => (props.toggled ? 'transparent' : props.theme.colors.neutrals[5])};
`;

const TouchableWrapper = styled(TouchableHighlight)`
  margin-left: -24px;
  margin-right: -24px;
  padding-left: 24px;
  padding-right: 24px;
`;
const CheckboxFieldText = styled(Text)`
  margin-left: ${props => props.theme.sizes[1]}px;
  margin-right: ${props => props.theme.sizes[1]}px;
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

const CheckboxField = ({ text, color, size, value, onChange, help, ...other }) => {
  const theme = useContext(ThemeContext);
  let boolValue;
  if (typeof value === 'boolean') {
    boolValue = value;
  } else {
    boolValue = value === 'true';
  }
  const update = () => onChange(!boolValue);
  const validColorSchema = getValidColorSchema(color);

  return (
    <TouchableWrapper
      underlayColor={theme.colors.complementary[validColorSchema][3]} // {colors.checkbox[color].checkedBackground}
      onPress={update}
    >
      <FlexContainer toggled={boolValue}>
        <Checkbox color={color} size={size} onChange={update} checked={boolValue} {...other} />
        <CheckboxFieldText color={color}>{text}</CheckboxFieldText>
        {Object.keys(help).length > 0 && <HelpButton {...help} />}
      </FlexContainer>
    </TouchableWrapper>
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
