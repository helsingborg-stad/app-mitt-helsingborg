import React, { useState } from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';

import { Input } from 'app/components/atoms';
import styled from 'styled-components/native';
import { CheckboxField } from 'app/components/molecules';
import theme from '../../../styles/theme';

const FlexRow = styled.View`
  flex-direction: row;
  max-height: 90px;
  height: 110px;
  flex: auto;
`;

const ConditionalTextField = props => {
  const {
    onChange,
    checkboxDisableText,
    checkboxEnableText,
    textFieldPlaceholder,
    color,
    value,
  } = props;

  const [textFieldState, setTextFieldState] = useState(!!value); // Show text field if we have prop with text.

  function disableTextField() {
    setTextFieldState(false);
    onChange('');
  }

  return (
    <View>
      <CheckboxField
        text={checkboxDisableText}
        color={color}
        size="small"
        value={textFieldState === false}
        onChange={() => disableTextField()}
      />
      <CheckboxField
        text={checkboxEnableText}
        color={color}
        size="small"
        value={textFieldState === true}
        onChange={() => setTextFieldState(true)}
      />

      {textFieldState ? (
        <FlexRow>
          <Input
            onChangeText={change => onChange(change)}
            placeholder={textFieldPlaceholder}
            multiline
          >
            {value}
          </Input>
        </FlexRow>
      ) : null}
    </View>
  );
};

ConditionalTextField.propTypes = {
  /**
   * Function that handles text input changes.
   */
  onChange: PropTypes.func,
  /**
   * The text to show at the side of the checkbox that will disable the text field.
   */
  checkboxDisableText: PropTypes.string.isRequired,
  /**
   * The text to show at the side of the checkbox that will enable the text field.
   */
  checkboxEnableText: PropTypes.string.isRequired,
  /**
   * Placeholder text to be shown in the text field.
   */
  textFieldPlaceholder: PropTypes.string,
  /**
   * Sets the color theme.
   */
  color: PropTypes.oneOf(Object.keys(theme.checkboxField)),
  /**
   * Text value in input field.
   * If defined, checkboxEnableText will be set true and input field populated with text.
   */
  value: PropTypes.string,
};

ConditionalTextField.defaultProps = {
  onChange: () => {},
  textFieldPlaceholder: '',
};

export default ConditionalTextField;
