import React, { useState } from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';

import { Input } from 'app/components/atoms';
import styled from 'styled-components/native/dist/styled-components.native.esm';
import { CheckboxField } from 'app/components/molecules';

const ConditionalTextField = props => {
  const {
    onInputChange,
    checkboxDisableText,
    checkboxEnableText,
    textFieldPlaceholder,
    text = undefined,
  } = props;

  const [textFieldState, setTextFieldState] = useState(!!text); // Show text field if we have prop with text.
  const [textFieldInput, setTextFieldInput] = useState(text || '');

  function onChange(change) {
    setTextFieldInput(change);
    onInputChange(change);
  }

  function disableTextField() {
    setTextFieldState(false);
    setTextFieldInput('');
  }

  return (
    <View>
      <CheckboxField
        text={checkboxDisableText}
        color="light"
        size="small"
        checked={textFieldState === false}
        onChange={() => disableTextField()}
      />
      <CheckboxField
        text={checkboxEnableText}
        color="light"
        size="small"
        checked={textFieldState === true}
        onChange={() => setTextFieldState(true)}
      />

      {textFieldState ? (
        <FlexRow>
          <Input
            onChangeText={change => onChange(change)}
            placeholder={textFieldPlaceholder}
            multiline
          >
            {textFieldInput}
          </Input>
        </FlexRow>
      ) : (
        <></>
      )}
    </View>
  );
};

const FlexRow = styled.View`
  flex-direction: row;
  max-height: 90px;
  height: 100%;
  flex: auto;
`;

ConditionalTextField.propTypes = {
  /**
   * Function that handles text input changes.
   */
  onInputChange: PropTypes.func,
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
   * Text value in input field.
   * If defined, checkboxEnableText will be set true and input field populated with text.
   */
  text: PropTypes.string,
};

ConditionalTextField.defaultProps = {
  onInputChange: () => {},
  textFieldPlaceholder: '',
};

export default ConditionalTextField;
