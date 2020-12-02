import React, { useState } from 'react';
import { View, LayoutAnimation } from 'react-native';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { Help } from '../../../types/FormTypes';
import Text from '../../atoms/Text';
import HelpButton from '../HelpButton';
import Fieldset, { FieldsetButton } from '../../atoms/Fieldset/Fieldset';
import { colorPalette } from '../../../styles/palette';
import theme from '../../../styles/theme';
import { Heading } from '../../atoms';

const ListBody = styled.View`
  padding-top: 12px;
  padding-bottom: 20px;
  height: auto;
`;

const ListBodyFieldLabel = styled(Heading)<{ colorSchema: string }>`
  margin-top: 5px;
  margin-left: 3px;
  font-weight: ${props => props.theme.fontWeights[1]};
  font-size: ${props => props.theme.fontSizes[3]};
  color: ${props => props.theme.colors.primary[props.colorSchema][1]};
`;

interface Props {
  heading?: string;
  items: { category: string; component: JSX.Element }[];
  categories: { category: string; description: string }[];
  color: string;
  showEditButton?: boolean;
  startEditable?: boolean;
  help?: Help;
}

/**
 * A grouped list, grouping items according to categories.
 * Can show an edit-button, which toggles an editable prop in the children, and an help button that opens a help modal.
 */
const GroupedList: React.FC<Props> = ({
  heading,
  items,
  categories,
  color,
  showEditButton,
  startEditable,
  help,
}) => {
  const [editable, setEditable] = useState(startEditable);

  const groupedItems: Record<string, { category: string; component: JSX.Element }[]> = {};
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
      renderHeaderActions={() => (
        <>
          {help && Object.keys(help).length > 0 && <HelpButton {...help} />}
          {showEditButton && (
            <FieldsetButton colorSchema={colorSchema} z={0} size="small" onClick={changeEditable}>
              <Text>{editable ? 'Färdig' : 'Ändra'}</Text>
            </FieldsetButton>
          )}
        </>
      )}
    >
      <ListBody>
        {Object.keys(groupedItems).map((key, index) => (
          <View key={`${index}-${key}`}>
            <ListBodyFieldLabel colorSchema={colorSchema}>
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
  color: PropTypes.oneOf(Object.keys(theme.colors.primary)),
  /**
   * Whether or not to show the edit button
   */
  showEditButton: PropTypes.bool,
  /**
   * Whether to start in editable mode or not
   */
  startEditable: PropTypes.bool,
  /**
   * Show a help button
   */
  help: PropTypes.shape({
    text: PropTypes.string,
    size: PropTypes.number,
    heading: PropTypes.string,
    tagline: PropTypes.string,
    url: PropTypes.string,
  }),
};

GroupedList.defaultProps = {
  items: [],
  categories: [],
  color: 'blue',
};
export default GroupedList;
