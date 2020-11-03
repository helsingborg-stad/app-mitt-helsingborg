import React, { useState } from 'react';
import { View, LayoutAnimation } from 'react-native';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { TouchableHighlight } from 'react-native-gesture-handler';
import Text from '../../atoms/Text/Text';
import Icon from '../../atoms/Icon/Icon';
import Label from '../../atoms/Label/Label';
import theme from '../../../styles/theme';
import { colorPalette } from '../../../styles/palette';

const FieldsetButton = styled(Button)`
  margin-left: 26px;
`;

const ListBody = styled.View`
  padding-top: 12px;
  padding-bottom: 20px;
  height: auto;
`;

const ListBodyFieldLabel = styled(Label)`
  margin-top: 5px;
`;

/**
 * A grouped list, grouping items according to categories.
 * Can show an edit-button, which toggles an editable prop in the children.
 */
const GroupedList = ({ heading, items, categories, color, showEditButton, startEditable }) => {
  const [editable, setEditable] = useState(startEditable);

  const groupedItems = {};
  const changeEditable = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setEditable(!editable);
  };

  categories.forEach(cat => {
    const catItems = items.filter(item => item.category === cat.category);
    if (catItems.length > 0) {
      groupedItems[cat.category] = catItems;
    }
  });
  const colorSchema = Object.keys(colorPalette.primary).includes(color) ? color : 'blue';

  return (
    <Fieldset
      colorSchema={colorSchema}
      legend={heading || ''}
      onIconPress={() => console.log('Icon is pressed')}
      iconName="help-outline"
      renderHeaderActions={() =>
        showEditButton && (
          <FieldsetButton colorSchema={colorSchema} z={0} size="small" onClick={changeEditable}>
            <Text>{editable ? 'Färdig' : 'Ändra'}</Text>
          </FieldsetButton>
        )
      }
    >
      <ListBody>
        {Object.keys(groupedItems)
          .sort((a, _b) => (a === 'sum' ? 1 : -1))
          .map((key, index) => (
            <View key={`${index}-${key}`}>
              <ListBodyFieldLabel underline>
                {categories.find(c => c.category === key).description}
              </ListBodyFieldLabel>
              {groupedItems[key].map(item => ({
                ...item.component,
                props: { ...item.component.props, editable },
              }))}
            </View>
          ))}
      </ListBody>
    </Fieldset>
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
   * Whether or not to show the edit button
   */
  showEditButton: PropTypes.bool,
  /**
   * Whether to start in editable mode or not
   */
  startEditable: PropTypes.bool,
};

GroupedList.defaultProps = {
  items: [],
  categories: [],
  color: 'light',
};
export default GroupedList;
