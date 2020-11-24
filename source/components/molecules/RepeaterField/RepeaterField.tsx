import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { LayoutAnimation } from 'react-native';
import { Button, Icon, Text } from '../../atoms';
import RepeaterFieldListItem from './RepeaterFieldListItem';
import Fieldset from '../../atoms/Fieldset/Fieldset';
import theme from '../../../styles/theme';

const AddButton = styled(Button)`
  margin-top: 30px;
  background: ${props => props.theme.colors.neutrals[7]};
  border: 0;
`
export interface InputRow {
  id: string;
  title: string;
  type: 'text' | 'date' | 'number';
}

interface Props {
  heading: string;
  addButtonText?: string;
  inputs: InputRow[];
  value: string | Record<string, string | number>[];
  onChange: (answers: Record<string, any> | string | number, fieldId?: string) => void;
  onBlur?: (answers: Record<string, any> | string | number, fieldId?: string) => void;
  color: string;
  error?: Record<string, {isValid: boolean, validationMessage: string}>[];
}
const emptyInput: Record<string, string | number>[] = [];

function isRecordArray(value: string | Record<string,string|number>[]): value is Record<string, string | number>[] {
  return typeof value !== 'string';
}
/**
 * Repeater field component, for adding multiple copies of a particular kind of input.
 * The input-prop specifies the form of each input-group.
 */
const RepeaterField: React.FC<Props> = ({ heading, addButtonText, inputs, onChange, onBlur, color, value, error }) => {
  const [localAnswers, setLocalAnswers] = useState( isRecordArray(value) ? value : emptyInput);
  
  const changeFromInput = (index: number) => (input: InputRow) => (text: string) => {
    localAnswers[index][input.id] = text;
    onChange(localAnswers);
    setLocalAnswers([...localAnswers]);
  };

  const onInputBlur = () => {
    if (onBlur) onBlur(localAnswers);
  };

  const removeAnswer = (index: number) => () => {
    setLocalAnswers(prev => {
      prev.splice(index, 1);
      onChange(prev);
      if (onBlur) onBlur(prev);
      return [...prev];
    });
  };

  const addAnswer = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setLocalAnswers(prev => [...prev, {}]);
  };

  const validColorSchema = Object.keys(theme.repeater).includes(color) ? color : 'blue';

  const listItems: JSX.Element[] = [];
  localAnswers.forEach((answer, index) => {
    listItems.push(
      <RepeaterFieldListItem
        key={`${index}`}
        heading={`${heading} ${index+1}`}
        inputs={inputs}
        value={answer}
        changeFromInput={changeFromInput(index)}
        onBlur={onInputBlur}
        color={validColorSchema}
        removeItem={removeAnswer(index)}
        error={error && error[index] ? error[index]: undefined}
      />
    );
  });
  return (
    <Fieldset legend={heading} colorSchema={validColorSchema} empty={listItems.length === 0}>
       {listItems}
      <AddButton onClick={addAnswer} colorSchema={"green"} block variant="outlined">
        <Icon name="add" color="green" />
        <Text>{addButtonText || 'Lägg till'}</Text>
      </AddButton>
    </Fieldset>
  );
};

RepeaterField.propTypes = {
  /**
   * The header text of the list.
   */
  heading: PropTypes.string,
  /**
   * List of inputs for a single element.
   */
  inputs: PropTypes.array,
  /**
   * What should happen when we update the values
   */
  onChange: PropTypes.func,
  /**
   * Sets the color scheme of the list. default is red.
   */
  color: PropTypes.string,
  /**
   * The value of the field.
   */
  value: PropTypes.any,
};

RepeaterField.defaultProps = {
  inputs: [],
  color: 'red',
  onChange: () => {},
};
export default RepeaterField;
