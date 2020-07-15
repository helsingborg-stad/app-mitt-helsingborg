import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { Icon, Heading, FieldLabel, Button } from 'source/components/atoms';

const Header = styled(Heading)`
  margin-left: 4px;
  margin-bottom: 8px;
`;
const ItemWrapper = styled(View)`
  margin-left: 4px;
  margin-bottom: 8px;
  border-bottom-color: ${props => props.theme.background.lighter};
  border-bottom-width: 1px;
  flex-direction: row;
  height: auto;
`;

const ListWrapper = styled.View`
  display: flex;
  flex-direction: column;

  width: 382px;
  height: auto;

  border-radius: 9.5px;
  overflow: hidden;
  margin-bottom: 16px;
  margin-left: -10px;
`;
const ListBody = styled.View`
  padding-top: 18px;
  padding-bottom: 24px;
  padding-left: 24px;
  padding-right: 24px;
  height: auto;
`;

const DeleteWrapper = styled.View`
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
  flex: 5;
`;

/**
 * A grouped list, where items can be removed.
 */
const GroupedList = ({ heading, items, categories, removable, ...other }) => {
  const groupedItems = {};
  Object.keys(categories).forEach(key => {
    const catItems = items.filter(item => item.category === key);
    if (catItems.length > 0) {
      groupedItems[key] = catItems;
    }
  });

  return (
    <ListWrapper>
      <Header type="h2">{heading}</Header>
      <ListBody>
        {Object.keys(groupedItems).map(key => (
          <View>
            <FieldLabel underline="false">{categories[key]}</FieldLabel>
            {groupedItems[key].map(item => (
              <ItemWrapper>
                {item.component}
                {removable ? (
                  <DeleteWrapper>
                    <Button
                      icon
                      pill
                      size="small"
                      onClick={item.remove}
                      style={{ marginBottom: 5 }}
                    >
                      <Icon name="delete" color="red" />
                    </Button>
                  </DeleteWrapper>
                ) : null}
              </ItemWrapper>
            ))}
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
  categories: PropTypes.object,
  /**
   * Whether or not to display the remove-button
   */
  removable: PropTypes.bool,
  other: PropTypes.any,
};

GroupedList.defaultProps = {
  items: [],
  categories: {},
  removable: true,
};
export default GroupedList;
