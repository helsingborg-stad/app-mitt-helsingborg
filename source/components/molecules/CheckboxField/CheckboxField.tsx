import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import styled, { ThemeContext } from 'styled-components/native';
import { TouchableHighlight } from 'react-native';
import HelpButton from '../HelpButton/HelpButton';
import Text from '../../atoms/Text/Text';
import Checkbox from '../../atoms/Checkbox/Checkbox';
import theme from '../../../styles/theme';
import { getValidColorSchema, PrimaryColor } from '../../../styles/themeHelpers';

// TODO: MOVE TO THEME.
const sizes = {
  small: {
    padding: 0.25,
    margin: 4,
    marginTop: 0,
    fontSize: 12,
  },
  medium: {
    padding: 0.5,
    margin: 4,
    fontSize: 15,
  },
  large: {
    padding: 1,
    margin: 5,
    fontSize: 18,
  },
};
const FlexContainer = styled.View<{ toggled?: boolean }>`
  flex: auto;
  flex-direction: row;
  align-items: flex-start;
  margin-left: -50px;
  margin-right: -50px;
  padding-left: 60px;
  padding-right: 60px;
  padding-top: ${(props) => props.theme.sizes[1]}px;
  padding-bottom: ${(props) => props.theme.sizes[1]}px;
  background-color: ${(props) => (props.toggled ? 'transparent' : props.theme.colors.neutrals[5])};
`;

const BoxTextWrapper = styled.View`
  flex: auto;
  flex-direction: row;
  align-items: flex-start;
`;

const TouchableWrapper = styled(TouchableHighlight)`
  margin-left: -24px;
  margin-right: -24px;
  padding-left: 24px;
  padding-right: 24px;
`;
const CheckboxFieldText = styled(Text)<{ size: 'small' | 'medium' | 'large' }>`
  margin-left: ${(props) => props.theme.sizes[1]}px;
  margin-right: ${(props) => props.theme.sizes[1]}px;
  font-size: ${(props) => sizes[props.size].fontSize}px;
`;

const StyledErrorText = styled(Text)`
  font-size: ${({ theme }) => theme.fontSizes[3]}px;
  color: ${(props) => props.theme.textInput.errorTextColor};
  font-weight: ${({ theme }) => theme.fontWeights[0]};
  margin-left: -50px;
  margin-right: -50px;
  padding-left: 60px;
  padding-right: 60px;
  padding-top: ${(props) => props.theme.sizes[1]}px;
  padding-bottom: ${(props) => props.theme.sizes[1]}px;
`;

interface CheckBoxProps {
  text?: string;
  colorSchema?: PrimaryColor;
  size?: 'small' | 'medium' | 'large';
  value: boolean | string;
  onChange?: (value: boolean) => void;
  help?: { text: string; size?: number; heading?: string; tagline?: string; url?: string };
  error?: { isValid: boolean; message: string };
}

/** A component with a checkbox next to a descriptive text, and possibly a help button */
const CheckboxField: React.FC<CheckBoxProps> = ({
  text,
  colorSchema,
  size,
  value,
  onChange,
  help,
  error,
  ...other
}) => {
  const theme = useContext(ThemeContext);
  let boolValue: boolean;
  if (typeof value === 'boolean') {
    boolValue = value;
  } else {
    boolValue = value === 'true';
  }
  const update = () => onChange(!boolValue);
  const validColorSchema = getValidColorSchema(colorSchema);
  return (
    <>
      <TouchableWrapper
        underlayColor={theme.colors.complementary[validColorSchema][3]}
        onPress={update}
      >
        <FlexContainer>
          <BoxTextWrapper>
            <Checkbox
              colorSchema={validColorSchema}
              size={size}
              onChange={update}
              checked={boolValue}
              {...other}
            />
            <CheckboxFieldText color={validColorSchema} size={size}>
              {text}
            </CheckboxFieldText>
          </BoxTextWrapper>
          {Object.keys(help).length > 0 && <HelpButton {...help} />}
        </FlexContainer>
      </TouchableWrapper>
      {error ? <StyledErrorText>{error?.message}</StyledErrorText> : <></>}
    </>
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
  colorSchema: PropTypes.oneOf(Object.keys(theme.colors.primary)),
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
  error: PropTypes.shape({
    isValid: PropTypes.bool.isRequired,
    message: PropTypes.string.isRequired,
  }),
};

CheckboxField.defaultProps = {
  onChange: () => {},
  colorSchema: 'blue',
  size: 'small',
  disabled: false,
  help: {},
};

export default CheckboxField;
