import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { TouchableHighlight } from 'react-native-gesture-handler';
import Text from '../../atoms/Text/Text';
import Icon from '../../atoms/Icon/Icon';
import Label from '../../atoms/Label/Label';
import theme from '../../../styles/theme';

const ListWrapper = styled.View`
  background-color: ${props => props.theme.groupedList[props.color].bodyBackground};
  color: ${props => props.theme.groupedList[props.color].bodyText};
  display: flex;
  flex-direction: column;
  width: 100%;
  height: auto;
  border-radius: 9.5px;
  overflow: hidden;
  margin-bottom: 16px;
  margin-top: 16px;
`;

const ListHeader = styled.View`
  background-color: ${props => props.theme.groupedList[props.color].headerBackground};
  color: ${props => props.theme.groupedList[props.color].headerText};
  padding-left: 24px;
  padding-right: 12px;
  padding-top: 12px;
  padding-bottom: 10px;
  position: relative;
  flex-direction: row;
  align-items: center;
  min-height: 58px;
`;

const HeaderTitleWrapper = styled.View`
  flex-direction: row;
  flex: 1;
`;

const HeaderTitle = styled(Text)`
  font-weight: 900;
  font-size: 14px;
  letter-spacing: 0.8px;
  text-transform: uppercase;
`;

const ListBody = styled.View`
  padding-top: 12px;
  padding-bottom: 20px;
  padding-left: 20px;
  padding-right: 20px;
  height: auto;
`;

const ListBodyFieldLabel = styled(Label)`
  margin-top: 40px;
`;

/**
 * A grouped list, grouping items according to categories.
 */
const GroupedList = ({ heading, items, categories, onEdit, color }) => {
  const groupedItems = {};

  categories.forEach(cat => {
    const catItems = items.filter(item => item.category === cat.category);
    if (catItems.length > 0) {
      groupedItems[cat.category] = catItems;
    }
  });

  return (
    <ListWrapper color={color}>
      <ListHeader color={color}>
        <HeaderTitleWrapper>
          <HeaderTitle>{heading}</HeaderTitle>
        </HeaderTitleWrapper>
        {onEdit ? (
          <TouchableHighlight onPress={onEdit}>
            <Icon name="create" color="#00213F" />
          </TouchableHighlight>
        ) : null}
      </ListHeader>
      <ListBody>
        {Object.keys(groupedItems)
          .sort((a, _b) => (a === 'sum' ? 1 : -1))
          .map((key, index) => (
            <View key={`${index}-${key}`}>
              <ListBodyFieldLabel underline>
                {categories.find(c => c.category === key).description}
              </ListBodyFieldLabel>
              {groupedItems[key].map(item => item.component)}
            </View>
          ))}
      </ListBody>
    </ListWrapper>
  );
};

GroupedList.propTypes = {
  /**
   * The header text of the list.
   */
  heading: PropTypes.string,
  /**
   * The items to display. Each item should have a component, a category and a remove function
   */
  items: PropTypes.array,
  /**
   * The allowed categories for the groupings
   */
  categories: PropTypes.array,
  /**
   *  Controls the color scheme of the list
   */
  color: PropTypes.oneOf(Object.keys(theme.groupedList)),
  /**
   * What should happen when the edit button is clicked.
   * Only display edit button if this prop is sent.
   */
  onEdit: PropTypes.func,
};

GroupedList.defaultProps = {
  items: [],
  categories: [],
  color: 'light',
};
export default GroupedList;
