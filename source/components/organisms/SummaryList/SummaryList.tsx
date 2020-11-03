import React from 'react';
import PropTypes from 'prop-types';
import GroupedList from '../../molecules/GroupedList/GroupedList';
import SummaryListItemComponent from './SummaryListItem';

export interface SummaryListItem {
  title: string;
  id: string;
  type: 'number' | 'text' | 'date' | 'arrayNumber' | 'arrayText' | 'arrayDate';
  category?: string;
  inputId?: string;
}

interface SummaryListCategory {
  category: string;
  description: string;
}

interface Props {
  heading: string;
  items: SummaryListItem[];
  categories?: SummaryListCategory[];
  onChange: (answers: Record<string, any> | string | number, fieldId: string) => void;
  color: string;
  answers: Record<string, any>;
}
/**
 * Summary list, that is linked and summarizes values from other input components.
 * The things to summarize is specified in the items prop.
 * The things are grouped into categories, as specified by the categories props.
 */
const SummaryList: React.FC<Props> = ({ heading, items, categories, onChange, color, answers }) => {
  /**
   * Given an item, and possibly an index in the case of repeater fields, this generates a function that
   * updates the form data from the input.
   * @param item The list item
   * @param index The index, when summarizing a repeater field with multiple answers
   */
  const changeFromInput = (item: SummaryListItem, index?: number) => (text: string) => {
    if (
      ['arrayNumber', 'arrayText', 'arrayDate'].includes(item.type) &&
      typeof index !== 'undefined' &&
      item.inputId
    ) {
      const oldAnswer: Record<string, string | number>[] = answers[item.id];
      oldAnswer[index][item.inputId] = text;
      onChange(oldAnswer, item.id);
    } else {
      onChange(text, item.id);
    }
  };
  /**
   * Given an item, and index in the case of repeater fields, this generates the function for clearing the associated data
   * in the form state.
   * @param item The list item
   * @param index The index, when summarizing a repeater field with multiple answers
   */
  const removeListItem = (item: SummaryListItem, index?: number) => () => {
    if (typeof index !== 'undefined') {
      const oldAnswer: Record<string, string | number>[] = answers[item.id];
      oldAnswer.splice(index, 1);
      onChange(oldAnswer, item.id);
    } else {
      onChange(undefined, item.id);
    }
  };

  /** Generates a list item */
  const generateListItem = (
    item: SummaryListItem,
    value: string | number | Record<string, any>,
    index?: number
  ) => ({
    category: item.category,
    component: (
      <SummaryListItemComponent
        item={item}
        index={index ? index + 1 : undefined}
        value={value}
        changeFromInput={changeFromInput(item, index)}
        removeItem={removeListItem(item, index)}
        color={color}
      />
    ),
  });

  const listItems = [];
  items
    .filter(item => {
      const answer = answers[item.id];
      return typeof answer !== 'undefined';
    })
    .forEach(item => {
      if (['arrayNumber', 'arrayText', 'arrayDate'].includes(item.type)) {
        const values: Record<string, string | number>[] = answers[item.id];
        if (values && values?.length > 0) {
          values.forEach((v, index) => {
            listItems.push(generateListItem(item, v[item?.inputId || item.id], index));
          });
        }
      } else {
        listItems.push(generateListItem(item, answers[item.id]));
      }
    });
  return (
    listItems.length > 0 && (
      <GroupedList
        heading={heading}
        items={listItems}
        categories={categories}
        color={color}
        showEditButton
        startEditable
      />
    )
  );
};

SummaryList.propTypes = {
  /**
   * The header text of the list.
   */
  heading: PropTypes.string,
  /**
   * List of all items, corresponding to all subforms
   */
  items: PropTypes.array,
  /**
   * The categories of the grouping
   */
  categories: PropTypes.array,
  /**
   * What should happen to update the values
   */
  onChange: PropTypes.func,
  /**
   * Sets the color scheme of the list. default is red.
   */
  color: PropTypes.string,
  /**
   * The form state answers
   */
  answers: PropTypes.object,
};

SummaryList.defaultProps = {
  items: [],
  color: 'blue',
  onChange: () => {},
};
export default SummaryList;
