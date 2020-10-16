import React from 'react';
import PropTypes from 'prop-types';
import GroupedList from '../../molecules/GroupedList/GroupedList';
import SummaryListItem from './SummaryListItem';

export interface Item {
  title: string;
  id: string;
  type: 'number' | 'text' | 'date' | 'arrayNumber' | 'arrayText' | 'arrayDate';
  category?: string;
  inputId?: string;
}

interface Category {
  category: string;
  description: string;
}

interface Props {
  heading: string;
  items: Item[];
  categories?: Category[];
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
  console.log(answers);
  const changeFromInput = (item: Item, index?: number) => (text: string) => {
    if (
      ['arrayNumber', 'arrayText', 'arrayDate'].includes(item.type) &&
      typeof index !== 'undefined' &&
      item.inputId
    ) {
      const oldValue: Record<string, string | number>[] = answers[item.id];
      oldValue[index][item.inputId] = text;
      onChange(oldValue, item.id);
    } else {
      onChange(text, item.id);
    }
  };

  const removeItem = (item: Item, index?: number) => () => {
    if (typeof index !== 'undefined') {
      const oldValue: Record<string, string | number>[] = answers[item.id];
      oldValue.splice(index, 1);
      onChange(oldValue, item.id);
    } else {
      onChange(undefined, item.id);
    }
  };

  const listItems = [];
  items
    .filter(item => {
      const val = answers[item.id];
      return typeof val !== 'undefined';
    })
    .forEach(item => {
      if (['arrayNumber', 'arrayText', 'arrayDate'].includes(item.type)) {
        const values: Record<string, string | number>[] = answers[item.id];
        if (values && values?.length > 0) {
          values.forEach((v, index) => {
            listItems.push({
              category: item.category,
              component: (
                <SummaryListItem
                  item={item}
                  index={index + 1}
                  value={v[item?.inputId || item.id]}
                  changeFromInput={changeFromInput(item, index)}
                  removeItem={removeItem(item, index)}
                  color={color}
                />
              ),
            });
          });
        }
      } else {
        listItems.push({
          category: item.category,
          component: (
            <SummaryListItem
              item={item}
              value={answers[item.id]}
              changeFromInput={changeFromInput(item)}
              removeItem={removeItem(item)}
              color={color}
            />
          ),
        });
      }
    });
  return <GroupedList heading={heading} items={listItems} categories={categories} color={color} />;
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
   * Message to display before anything has been added to the list.
   */
  answers: PropTypes.object,
};

SummaryList.defaultProps = {
  items: [],
  color: 'red',
  onChange: () => {},
};
export default SummaryList;
