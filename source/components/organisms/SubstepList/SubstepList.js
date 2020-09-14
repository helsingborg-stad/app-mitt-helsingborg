import React, { useState } from 'react';
import { View } from 'react-native';
import { TouchableHighlight, ScrollView } from 'react-native-gesture-handler';
import PropTypes from 'prop-types';
import { Input, Text, Icon, FieldLabel } from 'source/components/atoms';
import styled from 'styled-components/native';
import { SubstepButton } from 'source/components/molecules';
import GroupedList from 'app/components/molecules/GroupedList/GroupedList';
import colors from 'source/styles/colors';
import { excludePropetiesWithKey } from '../../../helpers/Objects';

const Wrapper = styled(View)`
  margin-bottom: 25px;
`;
const ItemWrapper = styled(View)`
  flex-direction: row;
  align-items: flex-end;
  height: 46px;
`;
const InputWrapper = styled.View`
  align-items: center;
  justify-content: flex-end;
  flex: 1;
  padding-left: 50px;
`;
const TextWrapper = styled.View`
  align-items: flex-end;
  justify-content: flex-end;
  flex: 10;
  padding-left: 0px;
`;
const SmallInput = styled(Input)`
  height: 40px;
  padding-top: 8px;
  padding-bottom: 8px;
`;
const SmallText = styled(Text)`
  height: 40px;
  font-size: 14px;
  padding-top: 11px;
  padding-bottom: 8px;
  padding-left: 17px;
`;
const LargeText = styled(Text)`
  height: 40px;
  font-size: 22px;
  font-weight: 800;
  padding-top: 11px;
  padding-bottom: 8px;
  padding-left: 17px;
`;
const DeleteButton = styled(Icon)`
  padding: 5px;
  margin-left: 15px;
  margin-right: 0px;
  margin-bottom: 15px;
  color: #dd6161;
`;

const FieldLabelContainer = styled.View`
  margin-top: 24px;
  margin-bottom: 8px;
  margin-left: 8px;
`;

const SubstepList = ({
  heading,
  items,
  categories,
  value,
  onChange,
  summary,
  color,
  placeholder,
}) => {
  const [editable, setEditable] = useState(!summary);

  const updateAnswer = itemTitle => data => {
    const newAnswers = JSON.parse(JSON.stringify(typeof value === 'string' ? {} : value));
    newAnswers[itemTitle] = data;
    onChange(newAnswers);
  };

  const changeFromInput = item => text => {
    const newAnswers = JSON.parse(JSON.stringify(typeof value === 'string' ? {} : value));
    newAnswers[item.title].amxount = text;
    onChange(newAnswers);
  };

  const removeItem = item => () => {
    const newAnswers = excludePropetiesWithKey(typeof value === 'string' ? {} : value, [
      item.title,
    ]);
    onChange(newAnswers);
  };

  const listItems = [];

  items.forEach((item, index) => {
    if (Object.keys(typeof value === 'string' ? {} : value).includes(item.title)) {
      listItems.push({
        category: item.category,
        component: (
          <ItemWrapper key={`${index}-${item.title}`}>
            {editable ? (
              <>
                <SubstepButton
                  text={item.title}
                  value={value[item.title] ? value[item.title] : {}}
                  onChange={updateAnswer(item.title)}
                  formId={item.formId}
                  color={colors.substepList[color].listButtonColor}
                  size="small"
                />
                <TouchableHighlight activeOpacity={1} onPress={removeItem(item)}>
                  <DeleteButton name="delete-forever" />
                </TouchableHighlight>
                <InputWrapper>
                  <SmallInput
                    textAlign="right"
                    keyboardType="numeric"
                    value={value[item.title].amount}
                    onChangeText={changeFromInput(item)}
                  />
                </InputWrapper>
              </>
            ) : (
              <>
                <SmallText>{item.title}</SmallText>
                <TextWrapper>
                  <SmallText>
                    {value[item.title].amount ? `${value[item.title].amount} kr` : '0 kr'}
                  </SmallText>
                </TextWrapper>
              </>
            )}
          </ItemWrapper>
        ),
      });
    }
  });

  // Render list items.
  if (!summary && listItems.length === 0) {
    if (!categories.find(c => c.category === 'placeholder')) {
      categories.push({ category: 'placeholder', description: '' });
    }

    listItems.push({
      category: 'placeholder',
      component: <LargeText style={{ marginTop: -50 }}>{placeholder}</LargeText>,
    });
  }

  // Render summery of list items.
  if (summary) {
    if (listItems.length === 0) {
      listItems.push({
        category: 'placeholder',
        component: <SmallText style={{ marginTop: -50 }}>{placeholder}</SmallText>,
      });
    } else {
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
      <GroupedList
        heading={heading}
        items={listItems}
        categories={categories}
        color={color}
        onEdit={() => setEditable(!editable)}
      />
      {editable && (
        <>
          <FieldLabelContainer>
            <FieldLabel>LÄGG TILL</FieldLabel>
          </FieldLabelContainer>
          <ScrollView horizontal>
            {items.map((item, index) =>
              Object.keys(value).includes(item.title) ? null : (
                <SubstepButton
                  key={`${index}-${item.title}`}
                  text={item.title}
                  iconName="add"
                  iconColor={colors.substepList[color].addButtonIconColor}
                  value={value[item.title] || {}}
                  color={colors.substepList[color].addButtonColor}
                  onChange={updateAnswer(item.title)}
                  formId={item.formId}
                />
              )
            )}
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
  /**
   * Message to display before anything has been added to the list.
   */
  placeholder: PropTypes.string,
};

SubstepList.defaultProps = {
  items: [],
  summary: false,
  color: 'red',
  placeholder: 'Du har inte lagt till något än',
  onChange: () => {},
};
export default SubstepList;
