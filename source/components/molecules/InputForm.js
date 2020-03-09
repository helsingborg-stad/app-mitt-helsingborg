import PropTypes from 'prop-types';
import React from 'react';
import { withTheme } from 'styled-components/native';
import { excludePropetiesWithKey, includePropetiesWithKey } from '../../helpers/Objects';
import Input from '../atoms/Input';
import ChatForm from './ChatForm';

const InputForm = props => {
  const chatFormProps = ['isFocused', 'submitHandler', 'changeHandler', 'inputValue', 'submitText'];
  const {
    theme: {
      input: { placeholder },
    },
  } = props;

  return (
    <ChatForm {...includePropetiesWithKey(props, chatFormProps)}>
      <Input
        placeholderTextColor={placeholder}
        {...excludePropetiesWithKey(props, chatFormProps)}
      />
    </ChatForm>
  );
};

InputForm.propTypes = {
  theme: PropTypes.shape({
    input: PropTypes.object,
  }),
};

export default withTheme(InputForm);
