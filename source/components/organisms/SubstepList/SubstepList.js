import React, { useState } from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import { Input } from 'source/components/atoms';
import styled from 'styled-components/native';
import { excludePropetiesWithKey } from 'source/helpers/Objects';
import { SubstepButton } from 'source/components/molecules';
import GroupedList from 'app/components/molecules/GroupedList/GroupedList';

const ItemWrapper = styled(View)`
  flex-direction: row;
  height: 46px;
  width: 250px;
`;
// flex-direction: column;
const InputWrapper = styled.View`
  align-items: center;
  justify-content: flex-end;
  flex: 5;
  padding-left: 50px;
`;
const SmallInput = styled(Input)`
  height: 40px;
  padding-top: 8px;
  padding-bottom: 8px;
`;

const SubstepList = ({ heading, items, categories, value, onChange, ...other }) => {
  const [answers, setAnswers] = useState(typeof value === 'string' ? {} : value);

  const updateAnswer = itemTitle => data => {
    const newAnswers = JSON.parse(JSON.stringify(answers));
    newAnswers[itemTitle] = data;
    setAnswers(newAnswers);
    onChange(newAnswers);
  };

  const changeFromInput = item => text => {
    const newAnswers = JSON.parse(JSON.stringify(answers));
    newAnswers[item.title].amount = text;
    setAnswers(newAnswers);
    onChange(newAnswers);
  };

  const removeItem = item => () => {
    const newAnswers = excludePropetiesWithKey(answers, [item.title]);
    setAnswers(newAnswers);
  };

  const listItems = [];
  items.forEach(item => {
    if (Object.keys(answers).includes(item.title)) {
      listItems.push({
        category: item.category,
        component: (
          <ItemWrapper>
            <SubstepButton
              text={item.title}
              value={answers[item.title] ? answers[item.title] : {}}
              onChange={updateAnswer(item.title)}
              formId={item.formId}
              color="light"
              size="small"
            />
            <InputWrapper>
              <SmallInput
                keyboardType="numeric"
                value={answers[item.title].amount}
                onChangeText={changeFromInput(item)}
              />
            </InputWrapper>
          </ItemWrapper>
        ),
        remove: removeItem(item),
      });
    }
  });

  return (
    <View>
      <GroupedList
        heading={heading}
        items={listItems}
        categories={categories}
        removeItem={() => {}}
      />
      {items.map(item =>
        Object.keys(answers).includes(item.title) ? null : (
          <SubstepButton
            text={item.title}
            value={answers[item.title] ? answers[item.title] : {}}
            onChange={updateAnswer(item.title)}
            formId={item.formId}
          />
        )
      )}
    </View>
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
  categories: PropTypes.object,
  /**
   * The values of the entire list object
   */
  value: PropTypes.object,
  /**
   * What should happen to update the values
   */
  onChange: PropTypes.func,
  other: PropTypes.any,
};

SubstepList.defaultProps = {
  items: [],
  onChange: () => {},
};
export default SubstepList;
