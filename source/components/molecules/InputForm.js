import React from 'react';
import { filterPropetiesByKeys } from '../../helpers/Objects';
import ChatForm from './ChatForm';
import Input from '../atoms/Input';

const InputForm = props => {
    return (
        <ChatForm {...filterPropetiesByKeys(props, ['isFocused', 'submitHandler', 'changeHandler', 'inputValue'])}>
            <Input {...props} />
        </ChatForm>
    );
};
export default InputForm;