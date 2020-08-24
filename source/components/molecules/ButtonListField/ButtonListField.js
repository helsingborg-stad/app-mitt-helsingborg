import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { Text } from 'react-native';
import { Button, Icon } from '../../atoms';

const ButtonListFieldWrapper = styled.View`
  flex: 1;
`;

const ButtonListFieldButton = styled(Button)`
  margin-bottom: 10px;
  min-width: 100%;
  justify-content: flex-start;
  align
`;

const ButtonListFieldLabel = styled.Text`
  margin-bottom: 20px;
  font-size: 12px;
  line-height: 18px;
  font-weight: bold;
`;

const ButtonListFieldIcon = styled(Icon)`
  margin-right: 10px;
`;

function ButtonListField({ id, onChange, options, label }) {
  const handleClick = value => {
    onChange({ id, value });
  };

  return (
    <ButtonListFieldWrapper>
      {label && <ButtonListFieldLabel>{label.toUpperCase()}</ButtonListFieldLabel>}
      {options.map(o => (
        <ButtonListFieldButton onClick={() => handleClick(o.value)}>
          {o.icon && <ButtonListFieldIcon name={o.icon} />}
          <Text>{o.text}</Text>
        </ButtonListFieldButton>
      ))}
    </ButtonListFieldWrapper>
  );
}

ButtonListField.propTypes = {
  /**
   * Id for identifying the field
   */
  id: PropTypes.string.isRequired,
  /**
   * Function for handle the input event that is triggerd
   */
  label: PropTypes.string,
  /**
   * Function for handle the input event that is triggerd
   */
  onChange: PropTypes.func.isRequired,
  /**
   * Options that will be displayed as buttons.
   */
  options: PropTypes.arrayOf({
    /**
     * Text that will be displayed in a button
     */
    text: PropTypes.string.isRequired,
    /**
     * An optional Icon that will show.
     */
    icon: PropTypes.string,
    /**
     * Value for the button
     */
    value: PropTypes.oneOfType([PropTypes.object, PropTypes.string, PropTypes.array]).isRequired,
  }),
};

ButtonListField.defaultProps = {
  label: null,
};

export default ButtonListField;
