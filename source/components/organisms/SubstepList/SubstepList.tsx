/* eslint-disable no-nested-ternary */
import React, { useState } from 'react';
import { View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import styled from 'styled-components/native';
import PropTypes from 'prop-types';
import { Text, FieldLabel } from '../../atoms';
import SubstepButton from '../../molecules/SubstepButton/SubstepButton';
import GroupedList from '../../molecules/GroupedList/GroupedList';
import colors from '../../../styles/colors';
import { excludePropetiesWithKey } from '../../../helpers/Objects';
import SubstepListItem from './SubstepListItem';

const Wrapper = styled(View)`
  margin-bottom: 25px;
`;

const LargeText = styled(Text)`
  height: 40px;
  font-size: 22px;
  font-weight: 800;
  padding-top: 11px;
  padding-bottom: 8px;
  padding-left: 17px;
`;

const FieldLabelContainer = styled.View`
  margin-top: 24px;
  margin-bottom: 8px;
  margin-left: 8px;
`;
export interface ShownField {
  heading: string;
  fieldId: string;
  category: string;
}

export interface Item {
  key: string;
  title: string;
  category: string;
  formId: string;
  shownFields: ShownField[];
  [x: string]: any;
}

interface Category {
  category: string;
  description: string;
}

interface Props {
  heading: string;
  items: Item[];
  categories: Category[];
  value: Record<string, any>;
  onChange: (val: Record<string, any>) => void;
  summary: boolean;
  color: string;
  buttonHelpText?: string;
  buttonHelpHeading?: string;
  buttonHelpTagline?: string;
  buttonHelpUrl?: string;
}

const SubstepList: React.FC<Props> = ({
  heading,
  items,
  categories,
  value,
  onChange,
  summary,
  color,
  buttonHelpText,
  buttonHelpHeading,
  buttonHelpTagline,
  buttonHelpUrl,
}) => {
  const [editable, setEditable] = useState(!summary);

  // aggregate the helper for the label above the buttons to add items.
  const buttonHelp = {
    text: buttonHelpText,
    heading: buttonHelpHeading,
    tagline: buttonHelpTagline,
    url: buttonHelpUrl,
  };

  const updateAnswer = (itemKey: string) => (data: Record<string, any>) => {
    const newAnswers = JSON.parse(JSON.stringify(typeof value === 'string' ? {} : value));
    newAnswers[itemKey] = data;
    onChange(newAnswers);
  };

  const changeFromInput = (item: Item) => (text: string) => {
    const newAnswers = JSON.parse(JSON.stringify(typeof value === 'string' ? {} : value));
    newAnswers[item.key].amount = text;
    onChange(newAnswers);
  };

  const removeItem = (item: Item) => () => {
    const newAnswers = excludePropetiesWithKey(typeof value === 'string' ? {} : value, [item.key]);
    onChange(newAnswers);
  };

  // generate the list items
  const listItems: { category: string; component: React.ReactNode }[] = [];
  items.forEach(item => {
    if (item.shownFields && item.shownFields.length > 0) {
      item.shownFields
        .filter(
          shownField =>
            Object.keys(typeof value === 'string' ? {} : value).includes(item.key) &&
            Object.keys(value[item.key]).includes(shownField.fieldId)
        )
        .forEach(shownField => {
          const props = {
            item,
            shownField,
            value,
            summary,
            editable,
            color,
            updateAnswer,
            removeItem,
            changeFromInput,
          };
          listItems.push({
            category: shownField.category,
            component: <SubstepListItem {...props} />,
          });
        });
    }
  });

  // Add the sum if we are in summary mode
  if (summary) {
    if (listItems.length > 0) {
      if (!categories.find(c => c.category === 'sum')) {
        categories.push({ category: 'sum', description: 'Summa' });
      }
      listItems.push({
        category: 'sum',
        component: (
          <LargeText>
            {Object.keys(value).reduce((prev, curr) => {
              const amount = parseFloat(value[curr].amount);
              // eslint-disable-next-line no-restricted-globals
              if (isNaN(amount)) {
                return prev;
              }
              return prev + amount;
            }, 0)}{' '}
            kr
          </LargeText>
        ),
      });
    }
  }

  return (
    <Wrapper>
      {listItems.length > 0 && (
        <GroupedList
          heading={heading}
          items={listItems}
          categories={categories}
          color={color}
          onEdit={() => setEditable(!editable)}
        />
      )}
      {editable && !summary && (
        <>
          <FieldLabelContainer>
            <FieldLabel help={buttonHelp}>LÄGG TILL</FieldLabel>
          </FieldLabelContainer>
          <ScrollView horizontal>
            {items.map((item: Record<string, any>, index: number) => (
              <SubstepButton
                key={`${index}-${item.title}`}
                text={item.title}
                iconName="add"
                iconColor={colors.substepList[color].addButtonIconColor}
                value={value[item.key] || {}}
                color={colors.substepList[color].addButtonColor}
                onChange={updateAnswer(item.key)}
                formId={item.formId}
                size="medium"
              />
            ))}
          </ScrollView>
        </>
      )}
    </Wrapper>
  );
};

SubstepList.propTypes = {
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
   * The values of the entire list object
   */
  value: PropTypes.object,
  /**
   * What should happen to update the values
   */
  onChange: PropTypes.func,
  /**
   * If the list acts as a summary; default is false.
   */
  summary: PropTypes.bool,
  /**
   * Sets the color scheme of the list. default is red.
   */
  color: PropTypes.string,
  /** help-object for the questionmark on the label above the buttons to add things. */
  buttonHelpUrl: PropTypes.string,
  /** help-object for the questionmark on the label above the buttons to add things. */
  buttonHelpText: PropTypes.string,
  /** help-object for the questionmark on the label above the buttons to add things. */
  buttonHelpHeading: PropTypes.string,
  /** help-object for the questionmark on the label above the buttons to add things. */
  buttonHelpTagline: PropTypes.string,
};

SubstepList.defaultProps = {
  items: [],
  summary: false,
  color: 'red',
  onChange: () => {},
};
export default SubstepList;
