import React from 'react';
import { DatePickerIOS } from 'react-native';
import { includePropetiesWithKey } from '../../helpers/Objects';
import ChatForm from './ChatForm';
import Input from '../atoms/Input';

const DateTimePickerForm = props => {
    const { changeHandler, submitHandler, inputValue, mode, selectorProps } = props;

    const date = typeof inputValue.getMonth === 'function' ? inputValue : new Date();
    let options = {};

    switch (mode) {
        case 'date':
            options.dateStyle = 'short';
            break;

        case 'time':
            options.timeStyle = 'short';
            break;

        default:
            options.dateStyle = 'short';
            options.timeStyle = 'short';
    }

    const dateString = typeof inputValue.getMonth === 'function' ? inputValue.toLocaleString('sv-SE', options) : '';
    const enhancedSubmitHandler = () => { dateString.length > 0 ? submitHandler(dateString) : null };

    return (
        <ChatForm
            {...includePropetiesWithKey(props, ['isFocused', 'changeHandler', 'inputValue'])}
            submitHandler={enhancedSubmitHandler}
            renderFooter={() => (
                <DatePickerIOS
                    date={date}
                    onDateChange={changeHandler}
                    mode={mode}
                    {...selectorProps}
                />
            )}
        >
            <Input
                placeholder={'Välj ett datum'}
                {...props}
                editable={false}
                value={dateString}
                onSubmitEditing={enhancedSubmitHandler}
            />
        </ChatForm>
    );
}

export default DateTimePickerForm;
