import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import GroupedList from '../../molecules/GroupedList/GroupedList';
import Text from '../../atoms/Text/Text';
import Heading from '../../atoms/Heading';
import SummaryListItemComponent from './SummaryListItem';
import { getValidColorSchema } from '../../../styles/theme';

const SumLabel = styled(Heading)<{ colorSchema: string }>`
  margin-top: 5px;
  margin-left: 3px;
  font-weight: ${props => props.theme.fontWeights[1]};
  font-size: ${props => props.theme.fontSizes[3]};
  color: ${props => props.theme.colors.primary[props.colorSchema][1]};
`;
const SumText = styled(Text)`
  margin-left: 4px;
  margin-top: 10px;
`;
// TODO: the sum component should be sent as a footer to the grouped list, at which point this container should be removed.
// Currently it's using a negative margin, which is a hack and only meant as a temporary fix.
const SumContainer = styled.View<{ colorSchema: string }>`
  width: 100%;
  height: auto;
  border-radius: 9.5px;
  overflow: hidden;
  margin-bottom: 24px;
  margin-top: -64px;
  padding-bottom: 20px;
  padding-top: 16px;
  padding-left: 16px;
  padding-right: 16px;
  background: ${props => props.theme.colors.complementary[props.colorSchema][3]};
`;
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
  showSum: boolean;
  startEditable?: boolean;
}
/**
 * Summary list, that is linked and summarizes values from other input components.
 * The things to summarize is specified in the items prop.
 * The things are grouped into categories, as specified by the categories props.
 */
const SummaryList: React.FC<Props> = ({
  heading,
  items,
  categories,
  onChange,
  color,
  answers,
  showSum,
  startEditable,
}) => {
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

  // Code for computing sum of all numeric values shown in the list
  let sum = 0;
  const addToSum = (value: string | number) => {
    if (typeof value === 'string') {
      const summand = parseInt(value);
      // eslint-disable-next-line no-restricted-globals
      sum += isNaN(summand) ? 0 : summand;
    } else {
      sum += value;
    }
  };

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
            if (item.type === 'arrayNumber') {
              const numericValue: string | number = v[item?.inputId || item.id];
              addToSum(numericValue);
            }
          });
        }
      } else {
        listItems.push(generateListItem(item, answers[item.id]));
        if (item.type === 'number') {
          const numericValue: number | string = answers[item.id];
          addToSum(numericValue);
        }
      }
    });

  const validColorSchema = getValidColorSchema(color);
  return (
    listItems.length > 0 && (
      <>
        <GroupedList
          heading={heading}
          items={listItems}
          categories={categories}
          color={color}
          showEditButton
          startEditable={startEditable}
        />
        {showSum && (
          <SumContainer colorSchema={validColorSchema}>
            <SumLabel colorSchema={validColorSchema}>Summa</SumLabel>
            <SumText type="h1">{sum} kr</SumText>
          </SumContainer>
        )}
      </>
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
  /**
   * Whether or not to show a sum of all numeric values at the bottom. Defaults to true.
   */
  showSum: PropTypes.bool,
  /**
   * Whether to start in editable mode or not.
   */
  startEditable: PropTypes.bool,
};

SummaryList.defaultProps = {
  items: [],
  color: 'blue',
  showSum: true,
  onChange: () => {},
};
export default SummaryList;
