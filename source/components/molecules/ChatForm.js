import React from 'react';
import { Keyboard } from 'react-native';
import styled from 'styled-components/native';
import PropTypes from 'prop-types';
import Button from '../atoms/Button/Button';
import Icon from '../atoms/Icon';
import Input, { input as inputStyles } from '../atoms/Input';
import Text from '../atoms/Text';

const ChatFormWrapper = styled.View``;
const ChatFormFooter = styled.View``;
const ChatFormBody = styled.View`
  margin-top: 12px;
  margin-bottom: 6px;
  margin-left: 16px;
  margin-right: 16px;
  flex-direction: row;
`;
const ChatFormButton = styled(Button)`
  min-width: auto;
  padding: 0px 8px 0px 0px;
  background: transparent;
`;

const ChatFormButtonIcon = styled(Icon)`
  color: ${props => props.theme.icon.light};
`;

const UnStyledInput = styled.TextInput`
  flex: 1;
  padding: 8px;
`;

const InputStyledView = styled.View`
  ${inputStyles}
  padding: 8px;
  flex-direction: row;
  flex: 1;
`;

const ChatForm = props => {
  const {
    style,
    renderFooter,
    submitHandler,
    changeHandler,
    inputValue,
    isFocused,
    submitText,
    ...other
  } = props;
  const formProps = { submitHandler, changeHandler, inputValue };

  const children = other.children
    ? React.Children.map(other.children, child => {
        if (!child.type) {
          return child;
        }

        if (child.type === Input) {
          return React.createElement(UnStyledInput, {
            onChangeText: changeHandler,
            value: inputValue,
            onSubmitEditing: submitHandler,
            ...child.props,
          });
        }

        return React.createElement(child.type, { form: { ...formProps }, ...child.props });
      })
    : false;

  return (
    <ChatFormWrapper>
      <ChatFormBody style={style}>
        {isFocused && (
          <ChatFormButton onClick={Keyboard.dismiss} z={0}>
            <ChatFormButtonIcon name="keyboard-hide" />
          </ChatFormButton>
        )}

        <InputStyledView>
          {children || (
            <UnStyledInput
              value={inputValue}
              onChangeText={changeHandler}
              onSubmitEditing={submitHandler}
              placeholder="Skriv något... "
              keyboardType="default"
              focus={!!isFocused}
            />
          )}

          <Button color="purpleLight" size="small" onClick={submitHandler} z={0}>
            {submitText ? <Text>{submitText}</Text> : <Text>Skicka</Text>}
          </Button>
        </InputStyledView>
      </ChatFormBody>

      {renderFooter ? <ChatFormFooter>{renderFooter()}</ChatFormFooter> : null}
    </ChatFormWrapper>
  );
};

ChatForm.propTypes = {
  style: PropTypes.shape({}),
  renderFooter: PropTypes.func,
  submitHandler: PropTypes.func,
  changeHandler: PropTypes.func,
  inputValue: PropTypes.string,
  isFocused: PropTypes.bool,
  submitText: PropTypes.string,
};

export default ChatForm;
