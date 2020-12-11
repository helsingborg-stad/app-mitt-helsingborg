import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import styled, { ThemeContext } from 'styled-components/native';
import { getValidColorSchema, PrimaryColor } from '../../../styles/themeHelpers';
import Icon from '../Icon';
import Text from '../Text';

interface BoxProps {
  checked: boolean;
  colorSchema: PrimaryColor;
  size: 'small' | 'medium' | 'large';
}

const Container = styled.View`
  flex: 1;
`;

const CheckboxBox = styled.TouchableHighlight<BoxProps>`
  border-style: solid;
  border-color: ${props =>
    props.checked ? 'transparent' : props.theme.colors.complementary[props.colorSchema][0]};
  background-color: ${props =>
    props.checked ? props.theme.colors.primary[props.colorSchema][3] : 'transparent'};
  width: ${props => props.theme.checkbox[props.size].width}px;
  height: ${props => props.theme.checkbox[props.size].height}px;
  padding: ${props => props.theme.checkbox[props.size].padding}px;
  margin: ${props => props.theme.checkbox[props.size].margin}px;
  border-width: ${props => props.theme.checkbox[props.size].borderWidth}px;
  border-radius: ${props => props.theme.checkbox[props.size].borderRadius}px;
`;

const CheckboxTick = styled(Icon)`
  color: ${props => props.theme.colors.neutrals[7]};
  margin-left: -2px;
  margin-top: -3px;
`;

const StyledErrorText = styled(Text)`
  font-size: ${({ theme }) => theme.fontSizes[3]};
  color: ${props => props.theme.textInput.errorTextColor};
  font-weight: ${({ theme }) => theme.fontWeights[0]};
  padding-top: 8px;
`;

interface Props {
  checked?: boolean;
  onChange: () => void;
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large';
  color: string;
}

const Checkbox: React.FC<Props> = ({ checked, onChange, size, disabled, color, error }) => {
  const theme = useContext(ThemeContext);
  const validColorSchema = getValidColorSchema(color);

  return (
    <Container>
      <CheckboxBox
        onPress={() => {
          if (!disabled) {
            onChange();
          }
        }}
        checked={checked}
        colorSchema={validColorSchema}
        underlayColor={theme.colors.primary[validColorSchema][2]}
        size={size || 'small'}
      >
        {checked ? <CheckboxTick size={theme.checkbox[size].icon} name="done" /> : <></>}
      </CheckboxBox>
      {error ? <StyledErrorText>{error?.message}</StyledErrorText> : <></>}
    </Container>
  );
};

Checkbox.propTypes = {
  /**
   * Boolean that determines if the checkbox is checked or not. Manages the 'state' of the component.
   */
  checked: PropTypes.bool.isRequired,
  /**
   * What happens when the checkbox is clicked.
   */
  onChange: PropTypes.func,
  /**
   * sets the color theme.
   */
  color: PropTypes.string,
  /**
   * One of small, medium, large
   */
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  /**
   * Disables the checkbox if true.
   */
  disabled: PropTypes.bool,
  error: PropTypes.shape({
    isValid: PropTypes.bool.isRequired,
    message: PropTypes.string.isRequired,
  }),
};

Checkbox.defaultProps = {
  onChange: () => {},
  color: 'blue',
  size: 'small',
  disabled: false,
};

export default Checkbox;
