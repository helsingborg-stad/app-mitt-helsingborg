import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Text } from '../../atoms';
import RepeaterFieldListItem from './RepeaterFieldListItem';
import Fieldset from '../../atoms/Fieldset/Fieldset';

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
  color: string;
}
const emptyInput: Record<string, string | number>[] = [];

function isRecordArray(value: string | Record<string,string|number>[]): value is Record<string, string | number>[] {
    return typeof value !== 'string';
}
/**
 * Repeater field component, for adding multiple copies of a particular kind of input.
 * The input-prop specifies the form of each input-group.
 */
const RepeaterField: React.FC<Props> = ({ heading, addButtonText, inputs, onChange, color, value }) => {
    const [localAnswers, setLocalAnswers] = useState( isRecordArray(value) ? value : emptyInput);

  const changeFromInput = (index: number) => (input: InputRow) => (text: string) => {
    localAnswers[index][input.id] = text;
    onChange(localAnswers);
    setLocalAnswers([...localAnswers]);
  };

  const removeAnswer = (index: number) => () => {
    setLocalAnswers(prev => {
      prev.splice(index, 1);
      onChange(prev);
      return [...prev];
    });
  };

  const addAnswer = () => {
    setLocalAnswers(prev => [...prev, {}]);
  };

  const listItems: JSX.Element[] = [];23
  localAnswers.forEach((answer, index) => {
    listItems.push(
      <RepeaterFieldListItem
        inputs={inputs}
        value={answer}
        changeFromInput={changeFromInput(index)}
        color={color}
        removeItem={removeAnswer(index)}
      />
    );
  });
  return (
    <>
      {localAnswers.length > 0 && <Fieldset legend={heading}>{listItems}</Fieldset>}
      <Button onClick={addAnswer} color={color}>
        <Text>{addButtonText || 'Lägg till'}</Text>
      </Button>
    </>
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
