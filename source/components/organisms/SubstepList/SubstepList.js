import React, { useState } from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import { Input, Button, Text } from 'source/components/atoms';
import styled from 'styled-components/native';
import { excludePropetiesWithKey } from 'source/helpers/Objects';
import { SubstepButton } from 'source/components/molecules';
import GroupedList from 'app/components/molecules/GroupedList/GroupedList';
import { ScrollView } from 'react-native-gesture-handler';

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
const TextWrapper = styled.View`
  align-items: center;
  justify-content: flex-end;
  flex: 10;
  padding-left: 100px;
`;
const SumWrapper = styled.View`
  align-items: center;
  margin-bottom: 5px;
`;
const ButtonWrapper = styled.View`
  align-items: center;
  margin-top: 10px;
`;
const SmallInput = styled(Input)`
  height: 40px;
  padding-top: 8px;
  padding-bottom: 8px;
`;
const SmallText = styled(Text)`
  height: 40px;
  padding-top: 8px;
  padding-bottom: 8px;
`;

const SubstepList = ({ heading, items, categories, value, onChange, summary, ...other }) => {
  const [editable, setEditable] = useState(!summary);

  const updateAnswer = itemTitle => data => {
    const newAnswers = JSON.parse(JSON.stringify(typeof value === 'string' ? {} : value));
    newAnswers[itemTitle] = data;
    onChange(newAnswers);
  };

  const changeFromInput = item => text => {
    const newAnswers = JSON.parse(JSON.stringify(typeof value === 'string' ? {} : value));
    newAnswers[item.title].amount = text;
    onChange(newAnswers);
  };

  const removeItem = item => () => {
    const newAnswers = excludePropetiesWithKey(typeof value === 'string' ? {} : value, [
      item.title,
    ]);
    onChange(newAnswers);
  };

  const listItems = [];
  items.forEach(item => {
    if (Object.keys(typeof value === 'string' ? {} : value).includes(item.title)) {
      listItems.push({
        category: item.category,
        component: (
          <ItemWrapper>
            {editable ? (
              <>
                <SubstepButton
                  text={item.title}
                  value={value[item.title] ? value[item.title] : {}}
                  onChange={updateAnswer(item.title)}
                  formId={item.formId}
                  color="light"
                  size="small"
                />
                <InputWrapper>
                  <SmallInput
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
        removable={editable}
        removeItem={() => {}}
      />
      {editable ? (
        <ScrollView horizontal>
          {items.map(item =>
            Object.keys(value).includes(item.title) ? null : (
              <SubstepButton
                text={item.title}
                value={value[item.title] || {}}
                onChange={updateAnswer(item.title)}
                formId={item.formId}
              />
            )
          )}
        </ScrollView>
      ) : null}
      {summary ? (
        <>
          <SumWrapper>
            <Text>
              Summa:{' '}
              {Object.keys(value).reduce((prev, curr) => {
                const amount = parseFloat(value[curr].amount);
                // eslint-disable-next-line no-restricted-globals
                if (isNaN(amount)) {
                  return prev;
                }
                return prev + amount;
              }, 0)}{' '}
              kr
            </Text>
          </SumWrapper>
          <ButtonWrapper>
            <Button color="dark" onClick={() => setEditable(!editable)}>
              <Text>{editable ? 'Lås' : 'Ändra'}</Text>
            </Button>
          </ButtonWrapper>
        </>
      ) : null}
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
  /**
   * If the list acts as a summary; default is false.
   */
  summary: PropTypes.bool,
  other: PropTypes.any,
};

SubstepList.defaultProps = {
  items: [],
  summary: false,
  onChange: () => {},
};
export default SubstepList;
